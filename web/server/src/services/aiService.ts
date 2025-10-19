import { openai, OPENAI_CONFIG } from '../config/openai';
import { Readable } from 'stream';
import { IAIScore } from '../models/Reply';

export interface VoiceAnalysis {
  clarity: {
    score: number;
    pronunciation: number;
    understandability: number;
    feedback: string;
  };
  confidence: {
    score: number;
    toneStability: number;
    energy: number;
    consistency: number;
  };
  depth: {
    score: number;
    conceptualCoverage: number;
    semanticRichness: number;
    feedback: string;
  };
  fluency: {
    score: number;
    smoothness: number;
    fillerWordRatio: number;
    wordPacing: number;
  };
  emotion: {
    score: number;
    expressiveness: number;
    engagement: number;
    sentiment: string;
  };
  overall: {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

export class AIService {
  /**
   * Transcribe audio file using Whisper API with retry logic
   */
  async transcribeAudio(audioBuffer: Buffer, filename: string, language?: string): Promise<string> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎤 Transcription attempt ${attempt}/${maxRetries}`);
        
        // Convert buffer to file-like object
        const file = new File([audioBuffer], filename, { type: 'audio/mpeg' });

        const transcription = await openai.audio.transcriptions.create({
          file: file,
          model: OPENAI_CONFIG.WHISPER_MODEL,
          language: language || undefined, // Auto-detect if not specified - supports multilingual
          response_format: 'text',
        });

        console.log('✅ Transcription successful');
        return transcription;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Transcription attempt ${attempt} failed:`, error.message);
        
        // Check if it's a network error that we can retry
        if (error.code === 'ECONNRESET' || error.type === 'system' || error.message?.includes('Connection error')) {
          if (attempt < maxRetries) {
            const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
            console.log(`⏳ Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        // If it's not a retryable error or we've exhausted retries, throw
        break;
      }
    }

    console.error('❌ All transcription attempts failed');
    throw new Error(`Failed to transcribe audio after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Comprehensive voice analysis with 5 dimensions
   */
  async analyzeVoiceQuality(transcript: string, audioMetadata?: any): Promise<VoiceAnalysis> {
    try {
      const analysisPrompt = `
Analyze this voice transcript for educational content quality across 5 dimensions. Provide detailed scores (0-100) and feedback:

TRANSCRIPT: "${transcript}"

Analyze for:

1. CLARITY (🎧):
- Pronunciation quality and accent clarity
- Word articulation and enunciation
- Overall understandability
- Audio waveform quality (if available)

2. CONFIDENCE (🎤):
- Tone stability and consistency
- Energy level and enthusiasm
- Speaker confidence and authority
- Volume and pitch variation

3. DEPTH (🧠):
- Conceptual coverage and completeness
- Educational value and accuracy
- Semantic richness and vocabulary
- Knowledge demonstration

4. FLUENCY (🗣️):
- Speech smoothness and flow
- Filler word usage (um, uh, like)
- Natural pacing and rhythm
- Silence patterns and pauses

5. EMOTION/ENGAGEMENT (🧩):
- Expressiveness and variation
- Audience engagement potential
- Emotional connection
- Delivery enthusiasm and passion

Provide response in this exact JSON format:
{
  "clarity": {
    "score": 85,
    "pronunciation": 90,
    "understandability": 80,
    "feedback": "Clear pronunciation with minor accent, very understandable"
  },
  "confidence": {
    "score": 78,
    "toneStability": 75,
    "energy": 80,
    "consistency": 80
  },
  "depth": {
    "score": 92,
    "conceptualCoverage": 95,
    "semanticRichness": 90,
    "feedback": "Excellent technical depth with concrete examples"
  },
  "fluency": {
    "score": 88,
    "smoothness": 85,
    "fillerWordRatio": 5,
    "wordPacing": 90
  },
  "emotion": {
    "score": 82,
    "expressiveness": 85,
    "engagement": 80,
    "sentiment": "positive"
  },
  "overall": {
    "score": 85,
    "feedback": "Strong educational content with clear, confident delivery",
    "strengths": ["Clear pronunciation", "Good technical depth", "Engaging delivery"],
    "improvements": ["Reduce filler words", "More consistent pacing", "Increase energy"]
  }
}
`;

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.GPT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert voice and educational content analyst. Provide detailed, constructive analysis in the exact JSON format requested. Be encouraging but honest in your feedback.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const analysisText = response.choices[0].message.content;
      if (!analysisText) {
        throw new Error('No analysis received from GPT-4');
      }

      // Parse JSON response
      const analysis = JSON.parse(analysisText) as VoiceAnalysis;
      return analysis;
    } catch (error) {
      console.error('Voice analysis error:', error);
      // Return default analysis if GPT-4 fails
      return {
        clarity: { score: 75, pronunciation: 75, understandability: 75, feedback: 'Analysis temporarily unavailable' },
        confidence: { score: 75, toneStability: 75, energy: 75, consistency: 75 },
        depth: { score: 75, conceptualCoverage: 75, semanticRichness: 75, feedback: 'Analysis temporarily unavailable' },
        fluency: { score: 75, smoothness: 75, fillerWordRatio: 10, wordPacing: 75 },
        emotion: { score: 75, expressiveness: 75, engagement: 75, sentiment: 'neutral' },
        overall: { score: 75, feedback: 'Voice analysis temporarily unavailable', strengths: [], improvements: [] }
      };
    }
  }

  /**
   * Evaluate reply content and return AI scores
   */
  async evaluateReply(
    text: string,
    question: string,
    isVoice: boolean = false
  ): Promise<IAIScore> {
    try {
      const prompt = `You are an expert educational content evaluator. Analyze the following answer to a question and provide scores (0-10) for the following criteria:

Question: ${question}
Answer: ${text}
Is Voice Reply: ${isVoice}

Provide a JSON response with the following structure:
{
  "clarity": <score 0-10>,
  "relevance": <score 0-10>,
  "depth": <score 0-10>,
  "simplicity": <score 0-10>,
  "confidence": <score 0-10>
}

Criteria:
- Clarity: How clear and well-structured is the explanation?
- Relevance: How directly does it answer the question?
- Depth: How thorough and detailed is the answer?
- Simplicity: How easy is it to understand?
- Confidence: How confident and authoritative does the answer sound?${isVoice ? ' (Consider speaking patterns)' : ''}

Return only the JSON object, no additional text.`;

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.GPT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      const scores = JSON.parse(content);
      
      // Calculate overall score
      const overallScore = (
        scores.clarity +
        scores.relevance +
        scores.depth +
        scores.simplicity +
        scores.confidence
      ) / 5;

      return {
        ...scores,
        overallScore: Math.round(overallScore * 10) / 10,
      };
    } catch (error) {
      console.error('Evaluation error:', error);
      throw new Error('Failed to evaluate reply');
    }
  }

  /**
   * Generate a concise summary of the reply
   */
  async generateSummary(text: string, maxLength: number = 150): Promise<string> {
    try {
      const prompt = `Summarize the following explanation in ${maxLength} characters or less. Make it concise and informative:

${text}

Summary:`;

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.GPT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 100,
      });

      return response.choices[0].message.content?.trim() || text.substring(0, maxLength);
    } catch (error) {
      console.error('Summary generation error:', error);
      return text.substring(0, maxLength) + '...';
    }
  }

  /**
   * Generate text embeddings for semantic search
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: OPENAI_CONFIG.EMBEDDING_MODEL,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate speech from text using TTS
   */
  async generateSpeech(text: string): Promise<Buffer> {
    try {
      const mp3Response = await openai.audio.speech.create({
        model: OPENAI_CONFIG.TTS_MODEL,
        voice: OPENAI_CONFIG.TTS_VOICE,
        input: text.substring(0, 4096), // TTS has character limits
      });

      const buffer = Buffer.from(await mp3Response.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error('TTS generation error:', error);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Generate flashcards from content
   */
  async generateFlashcards(content: string, count: number = 5): Promise<Array<{ question: string; answer: string }>> {
    try {
      const prompt = `Generate ${count} educational flashcards from the following content. Each flashcard should have a clear question and a concise answer.

Content:
${content}

Return a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "answer": "Answer text here"
  }
]

Focus on key concepts and important information. Return only the JSON array, no additional text.`;

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.GPT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const content_response = response.choices[0].message.content;
      if (!content_response) {
        return [];
      }

      const result = JSON.parse(content_response);
      return Array.isArray(result) ? result : result.flashcards || [];
    } catch (error) {
      console.error('Flashcard generation error:', error);
      return [];
    }
  }

  /**
   * Personalize reply ranking based on user type
   */
  calculatePersonalizedScore(
    aiScore: IAIScore,
    userType: 'QuickLearner' | 'FullMark' | 'Average' | 'Beginner'
  ): number {
    const weights = {
      QuickLearner: { simplicity: 0.4, relevance: 0.4, clarity: 0.2 },
      FullMark: { depth: 0.4, clarity: 0.3, relevance: 0.3 },
      Average: { clarity: 0.3, relevance: 0.3, simplicity: 0.2, depth: 0.2 },
      Beginner: { simplicity: 0.5, clarity: 0.3, relevance: 0.2 },
    };

    const userWeights = weights[userType];
    let score = 0;

    for (const [key, weight] of Object.entries(userWeights)) {
      score += (aiScore[key as keyof IAIScore] as number) * weight;
    }

    return Math.round(score * 10) / 10;
  }
}

export default new AIService();

