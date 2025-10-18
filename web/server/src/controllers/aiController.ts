import { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import aiService from '../services/aiService';
import cloudinaryService from '../services/cloudinaryService';
import Reply from '../models/Reply';

export const transcribeAudio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('No audio file provided', 400));
  }

  const transcript = await aiService.transcribeAudio(req.file.buffer, req.file.originalname);

  res.status(200).json({
    success: true,
    data: { transcript },
  });
});

export const uploadVoiceReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('No audio file provided', 400));
  }

  const { threadId, userId } = req.body;

  // Upload audio to Cloudinary
  const voiceUrl = await cloudinaryService.uploadAudio(req.file.buffer, req.file.originalname);

  // Transcribe audio
  const transcript = await aiService.transcribeAudio(req.file.buffer, req.file.originalname);

  // Create reply with voice data
  const reply = await Reply.create({
    threadId,
    userId,
    text: transcript,
    voiceUrl,
    transcript,
    isVoiceReply: true,
    language: req.body.language || 'en',
  });

  // Process with AI in background (evaluation, summary, etc.)
  processVoiceReplyWithAI(reply._id.toString(), transcript, voiceUrl);

  res.status(201).json({
    success: true,
    data: reply,
  });
});

export const generateSummaryAudio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body;

  if (!text) {
    return next(new AppError('Text is required', 400));
  }

  // Generate speech
  const audioBuffer = await aiService.generateSpeech(text);

  // Upload to Cloudinary
  const audioUrl = await cloudinaryService.uploadAudio(audioBuffer, 'summary.mp3');

  res.status(200).json({
    success: true,
    data: { audioUrl },
  });
});

export const evaluateText = asyncHandler(async (req: Request, res: Response) => {
  const { text, question } = req.body;

  if (!text || !question) {
    return res.status(400).json({
      success: false,
      error: 'Text and question are required',
    });
  }

  const aiScore = await aiService.evaluateReply(text, question);

  res.status(200).json({
    success: true,
    data: aiScore,
  });
});

export const generateSummary = asyncHandler(async (req: Request, res: Response) => {
  const { text, maxLength } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'Text is required',
    });
  }

  const summary = await aiService.generateSummary(text, maxLength);

  res.status(200).json({
    success: true,
    data: { summary },
  });
});

export const generateFlashcardsFromText = asyncHandler(async (req: Request, res: Response) => {
  const { text, count } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'Text is required',
    });
  }

  const flashcards = await aiService.generateFlashcards(text, count || 5);

  res.status(200).json({
    success: true,
    data: flashcards,
  });
});

// Background processing for voice replies
async function processVoiceReplyWithAI(replyId: string, transcript: string, voiceUrl: string) {
  try {
    const reply = await Reply.findById(replyId).populate('threadId');
    if (!reply) return;

    const thread = reply.threadId as any;

    // Generate AI score (voice replies get confidence evaluation)
    const aiScore = await aiService.evaluateReply(transcript, thread.question, true);

    // Generate summary
    const aiSummary = await aiService.generateSummary(transcript);

    // Generate TTS for summary
    let summaryAudioUrl;
    try {
      const audioBuffer = await aiService.generateSpeech(aiSummary);
      summaryAudioUrl = await cloudinaryService.uploadAudio(audioBuffer, 'summary.mp3');
    } catch (error) {
      console.error('Failed to generate summary audio:', error);
    }

    // Update reply
    await Reply.findByIdAndUpdate(replyId, {
      aiScore,
      aiSummary,
      summaryAudioUrl,
    });

    console.log(`✅ Voice reply processing completed for ${replyId}`);
  } catch (error) {
    console.error(`❌ Voice reply processing failed for ${replyId}:`, error);
  }
}

