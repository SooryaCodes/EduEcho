# AI Integration Guide

Complete guide for integrating OpenAI services and Pinecone vector database in EduEcho.

## Overview

EduEcho uses multiple AI services:
1. **Whisper** - Voice transcription
2. **GPT-4** - Content evaluation & summarization
3. **Embeddings** - Semantic search
4. **TTS** - Text-to-speech
5. **Pinecone** - Vector storage

## OpenAI Setup

### 1. Get API Key

1. Go to https://platform.openai.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy and save securely

### 2. Configure in .env

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx
```

### 3. Verify Setup

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Whisper Integration (Voice Transcription)

### Configuration

```typescript
// config/openai.ts
export const OPENAI_CONFIG = {
  WHISPER_MODEL: 'whisper-1',
  // Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
};
```

### Usage

```typescript
// services/aiService.ts
async transcribeAudio(audioBuffer: Buffer, filename: string) {
  const file = new File([audioBuffer], filename);
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    language: 'en',  // or auto-detect
  });
  
  return transcription.text;
}
```

### API Endpoint

```http
POST /api/v1/ai/transcribe
Content-Type: multipart/form-data

audio: [file]
```

### Response Time

- Typical: 2-5 seconds for 1-minute audio
- Max audio length: 25MB

### Error Handling

```typescript
try {
  const transcript = await transcribeAudio(buffer, filename);
} catch (error) {
  if (error.code === 'audio_too_large') {
    // Split audio or compress
  } else if (error.code === 'invalid_format') {
    // Return format error to user
  }
  throw new Error('Transcription failed');
}
```

## GPT-4 Integration (Evaluation & Summary)

### Content Evaluation

**Prompt Engineering:**

```typescript
const prompt = `You are an expert educational content evaluator.
Analyze the following answer and provide scores (0-10):

Question: ${question}
Answer: ${text}

Provide JSON response:
{
  "clarity": <0-10>,
  "relevance": <0-10>,
  "depth": <0-10>,
  "simplicity": <0-10>,
  "confidence": <0-10>
}

Criteria:
- Clarity: Well-structured and clear
- Relevance: Directly answers question
- Depth: Thorough and detailed
- Simplicity: Easy to understand
- Confidence: Authoritative tone

Return only JSON, no additional text.`;
```

### Configuration

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3,  // Low for consistent scoring
  max_tokens: 300,
  response_format: { type: 'json_object' },
});
```

### Summarization

```typescript
const summaryPrompt = `Summarize the following in 150 characters:

${text}

Make it concise and informative.`;

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: summaryPrompt }],
  temperature: 0.5,
  max_tokens: 100,
});
```

### Cost Optimization

**GPT-4 Pricing (as of 2024):**
- Input: $0.01 / 1K tokens
- Output: $0.03 / 1K tokens

**Tips:**
1. Use GPT-3.5-turbo for summaries (10x cheaper)
2. Cache common evaluations
3. Batch requests when possible
4. Use lower max_tokens
5. Implement retry with exponential backoff

### Error Handling

```typescript
try {
  const score = await evaluateReply(text, question);
} catch (error) {
  if (error.code === 'rate_limit_exceeded') {
    await delay(1000);
    return retry(evaluateReply, text, question);
  } else if (error.code === 'context_length_exceeded') {
    // Truncate text and retry
    return evaluateReply(text.substring(0, 4000), question);
  }
  throw error;
}
```

## Embeddings Integration (Semantic Search)

### Model Configuration

```typescript
// config/openai.ts
EMBEDDING_MODEL: 'text-embedding-3-small'
// Dimensions: 1536
// Cost: $0.00002 / 1K tokens
```

### Generate Embedding

```typescript
async generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  
  return response.data[0].embedding;
}
```

### Best Practices

1. **Clean text before embedding:**
```typescript
const cleanText = text
  .replace(/\s+/g, ' ')  // Normalize whitespace
  .trim()
  .substring(0, 8000);  // Limit length
```

2. **Batch embeddings:**
```typescript
const response = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: [text1, text2, text3],  // Batch up to 100
});
```

3. **Cache embeddings:**
Store in database to avoid regenerating.

### Usage in Search

```typescript
// 1. Generate query embedding
const queryEmbedding = await generateEmbedding(searchQuery);

// 2. Search Pinecone
const results = await pinecone.query({
  vector: queryEmbedding,
  topK: 10,
});

// 3. Fetch full content from MongoDB
const content = await Thread.find({
  _id: { $in: results.matches.map(m => m.id) }
});
```

## TTS Integration (Text-to-Speech)

### Configuration

```typescript
// config/openai.ts
TTS_MODEL: 'tts-1',  // or 'tts-1-hd' for higher quality
TTS_VOICE: 'alloy',  // alloy, echo, fable, onyx, nova, shimmer
```

### Generate Speech

```typescript
async generateSpeech(text: string): Promise<Buffer> {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: text.substring(0, 4096),  // TTS limit
  });
  
  return Buffer.from(await response.arrayBuffer());
}
```

### Voice Options

- **alloy** - Neutral, versatile
- **echo** - Male, warm
- **fable** - British accent, expressive
- **onyx** - Deep male voice
- **nova** - Female, energetic
- **shimmer** - Soft female voice

### API Endpoint

```http
POST /api/v1/ai/summary-audio
Content-Type: application/json

{
  "text": "Summary text to speak"
}
```

### Cost & Performance

- **Cost:** $0.015 / 1K characters
- **Speed:** ~2-3 seconds for 150 characters
- **Quality:** tts-1 (fast), tts-1-hd (better quality)

## Pinecone Integration

### 1. Setup Pinecone

1. Sign up at https://www.pinecone.io
2. Create a new project
3. Create an index:
   - Name: `eduecho-embeddings`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Pod type: `starter` (free tier)

### 2. Get Credentials

```env
PINECONE_API_KEY=your-api-key
PINECONE_INDEX_NAME=eduecho-embeddings
```

### 3. Initialize Client

```typescript
// config/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const getPineconeIndex = () => {
  return pinecone.index(process.env.PINECONE_INDEX_NAME);
};
```

### 4. Store Vectors

```typescript
async storeEmbedding(text: string, metadata: any) {
  // Generate embedding
  const embedding = await aiService.generateEmbedding(text);
  
  // Store in Pinecone
  const vectorId = uuidv4();
  const index = getPineconeIndex();
  
  await index.upsert([{
    id: vectorId,
    values: embedding,
    metadata: {
      contentType: 'reply',
      contentId: replyId,
      text: text.substring(0, 1000),
      ...metadata
    }
  }]);
  
  return vectorId;
}
```

### 5. Query Vectors

```typescript
async searchSimilar(query: string, filters?: any, topK = 10) {
  const embedding = await generateEmbedding(query);
  const index = getPineconeIndex();
  
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    filter: filters,  // e.g., { contentType: 'reply' }
  });
  
  return results.matches;
}
```

### 6. Filtering

```typescript
// Search only replies from a specific subject
const filters = {
  contentType: 'reply',
  subject: 'Computer Science'
};

const results = await searchSimilar(query, filters);
```

### 7. Metadata Best Practices

Store minimal metadata:
```typescript
{
  contentType: 'reply',
  contentId: '507f1f77bcf86cd799439011',
  userId: '507f191e810c19729de860ea',
  subject: 'Math',
  language: 'en',
  text: 'First 1000 chars...'  // For preview
}
```

## Complete Workflow Example

### Voice Reply Processing

```typescript
async function processVoiceReply(audioBuffer: Buffer, threadId: string) {
  // 1. Upload audio to Cloudinary
  const voiceUrl = await cloudinaryService.uploadAudio(audioBuffer);
  
  // 2. Transcribe with Whisper
  const transcript = await aiService.transcribeAudio(audioBuffer);
  
  // 3. Create reply
  const reply = await Reply.create({
    threadId,
    text: transcript,
    voiceUrl,
    isVoiceReply: true,
  });
  
  // 4. Background processing
  processInBackground(async () => {
    // Get thread question
    const thread = await Thread.findById(threadId);
    
    // 5. Evaluate with GPT-4
    const aiScore = await aiService.evaluateReply(
      transcript,
      thread.question,
      true  // isVoice
    );
    
    // 6. Generate summary
    const aiSummary = await aiService.generateSummary(transcript);
    
    // 7. Generate summary audio
    const summaryBuffer = await aiService.generateSpeech(aiSummary);
    const summaryAudioUrl = await cloudinaryService.uploadAudio(summaryBuffer);
    
    // 8. Generate embedding
    const vectorId = await vectorService.storeEmbedding(transcript, {
      contentType: 'reply',
      contentId: reply._id.toString(),
    });
    
    // 9. Update reply
    await Reply.findByIdAndUpdate(reply._id, {
      aiScore,
      aiSummary,
      summaryAudioUrl,
    });
    
    // 10. Store embedding reference
    await Embedding.create({
      vectorId,
      contentType: 'reply',
      contentId: reply._id,
      text: transcript,
    });
  });
  
  return reply;
}
```

## Performance Optimization

### 1. Parallel Processing

```typescript
// Process multiple AI operations in parallel
const [aiScore, aiSummary, embedding] = await Promise.all([
  aiService.evaluateReply(text, question),
  aiService.generateSummary(text),
  aiService.generateEmbedding(text),
]);
```

### 2. Caching

```typescript
// Cache embeddings in MongoDB
const cached = await Embedding.findOne({ text });
if (cached) {
  return cached.embedding;
}
```

### 3. Rate Limiting

```typescript
// Implement token bucket
const limiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 'minute'
});

await limiter.removeTokens(1);
const result = await openai.chat.completions.create(...);
```

### 4. Batch Operations

```typescript
// Batch embeddings for multiple texts
const embeddings = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: texts,  // Array of texts
});
```

## Error Handling & Retries

### Retry Strategy

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      if (error.code === 'rate_limit_exceeded') {
        await sleep(delay * Math.pow(2, i));  // Exponential backoff
      } else {
        throw error;  // Don't retry other errors
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Usage

```typescript
const score = await withRetry(() => 
  aiService.evaluateReply(text, question)
);
```

## Monitoring & Logging

### Track API Usage

```typescript
let apiCallCount = 0;
let totalTokens = 0;

async function trackAPICall<T>(fn: () => Promise<T>): Promise<T> {
  apiCallCount++;
  const start = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - start;
    
    console.log(`API Call ${apiCallCount}: ${duration}ms`);
    return result;
  } catch (error) {
    console.error(`API Call failed: ${error.message}`);
    throw error;
  }
}
```

### Cost Tracking

```typescript
interface CostTracker {
  whisperMinutes: number;
  gpt4Tokens: number;
  embeddingTokens: number;
  ttsCharacters: number;
}

function calculateCost(tracker: CostTracker): number {
  return (
    tracker.whisperMinutes * 0.006 +
    tracker.gpt4Tokens * 0.00002 +
    tracker.embeddingTokens * 0.00000002 +
    tracker.ttsCharacters * 0.000015
  );
}
```

## Testing AI Integration

### Mock OpenAI for Tests

```typescript
// __mocks__/openai.ts
export const openai = {
  audio: {
    transcriptions: {
      create: jest.fn().mockResolvedValue({
        text: 'Mock transcript'
      })
    }
  },
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: '{"clarity": 8}' } }]
      })
    }
  }
};
```

### Integration Tests

```typescript
describe('AI Services', () => {
  it('should transcribe audio', async () => {
    const buffer = fs.readFileSync('test-audio.mp3');
    const transcript = await aiService.transcribeAudio(buffer);
    expect(transcript).toBeTruthy();
  });
});
```

## Production Checklist

- [ ] API keys stored securely in environment variables
- [ ] Rate limiting implemented
- [ ] Error handling with retries
- [ ] Cost monitoring in place
- [ ] Caching strategy implemented
- [ ] Batch operations where possible
- [ ] Proper logging and monitoring
- [ ] Token limits validated
- [ ] Fallback strategies for API failures
- [ ] Load testing completed

## Troubleshooting

### Common Issues

**1. Rate Limit Errors**
```
Error: 429 Rate limit exceeded
Solution: Implement exponential backoff, upgrade plan
```

**2. Invalid Audio Format**
```
Error: Audio format not supported
Solution: Convert to mp3/wav before upload
```

**3. Context Length Exceeded**
```
Error: Maximum context length exceeded
Solution: Truncate text to 8000 characters
```

**4. Pinecone Dimension Mismatch**
```
Error: Vector dimension mismatch
Solution: Ensure embedding model matches index (1536)
```

## Support Resources

- OpenAI Docs: https://platform.openai.com/docs
- Pinecone Docs: https://docs.pinecone.io
- OpenAI Community: https://community.openai.com
- Status Page: https://status.openai.com
