import { Request, Response, NextFunction } from 'express';
import Reply from '../models/Reply';
import Thread from '../models/Thread';
import User from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import aiService from '../services/aiService';
import vectorService from '../services/vectorService';

export const createReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { threadId, userId, text } = req.body;

  // Verify thread exists
  const thread = await Thread.findById(threadId);
  if (!thread) {
    return next(new AppError('Thread not found', 404));
  }

  // Create reply
  const reply = await Reply.create(req.body);

  // Update thread reply count
  await Thread.findByIdAndUpdate(threadId, { $inc: { replyCount: 1 } });

  // Update user stats
  await User.findByIdAndUpdate(userId, {
    $inc: { contributionCount: 1, points: 3 },
  });

  // Process with AI in background
  processReplyWithAI(reply._id.toString(), text, thread.question);

  res.status(201).json({
    success: true,
    data: reply,
  });
});

export const getRepliesByThread = asyncHandler(async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { sortBy = 'createdAt', userType } = req.query;

  let replies = await Reply.find({ threadId })
    .populate('userId', 'name avatar type')
    .sort({ [sortBy as string]: -1 });

  // Personalize ranking based on user type
  if (userType && ['QuickLearner', 'FullMark', 'Average', 'Beginner'].includes(userType as string)) {
    replies = replies.map((reply) => {
      if (reply.aiScore) {
        const personalizedScore = aiService.calculatePersonalizedScore(
          reply.aiScore,
          userType as any
        );
        return { ...reply.toObject(), personalizedScore };
      }
      return reply;
    }).sort((a: any, b: any) => (b.personalizedScore || 0) - (a.personalizedScore || 0));
  }

  res.status(200).json({
    success: true,
    data: replies,
  });
});

export const getReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const reply = await Reply.findById(req.params.id).populate('userId', 'name avatar type');

  if (!reply) {
    return next(new AppError('Reply not found', 404));
  }

  res.status(200).json({
    success: true,
    data: reply,
  });
});

export const updateReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const reply = await Reply.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!reply) {
    return next(new AppError('Reply not found', 404));
  }

  res.status(200).json({
    success: true,
    data: reply,
  });
});

export const deleteReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const reply = await Reply.findByIdAndDelete(req.params.id);

  if (!reply) {
    return next(new AppError('Reply not found', 404));
  }

  // Update thread reply count
  await Thread.findByIdAndUpdate(reply.threadId, { $inc: { replyCount: -1 } });

  res.status(200).json({
    success: true,
    message: 'Reply deleted successfully',
  });
});

export const upvoteReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const reply = await Reply.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );

  if (!reply) {
    return next(new AppError('Reply not found', 404));
  }

  // Award points to reply author
  await User.findByIdAndUpdate(reply.userId, {
    $inc: { upvotesReceived: 1, points: 1 },
  });

  res.status(200).json({
    success: true,
    data: reply,
  });
});

export const downvoteReply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const reply = await Reply.findByIdAndUpdate(
    req.params.id,
    { $inc: { downvotes: 1 } },
    { new: true }
  );

  if (!reply) {
    return next(new AppError('Reply not found', 404));
  }

  res.status(200).json({
    success: true,
    data: reply,
  });
});

export const markBestAnswer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const reply = await Reply.findByIdAndUpdate(
    req.params.id,
    { isBestAnswer: true },
    { new: true }
  );

  if (!reply) {
    return next(new AppError('Reply not found', 404));
  }

  // Unmark other replies in the same thread
  await Reply.updateMany(
    { threadId: reply.threadId, _id: { $ne: reply._id } },
    { isBestAnswer: false }
  );

  // Award bonus points
  await User.findByIdAndUpdate(reply.userId, { $inc: { points: 10 } });

  res.status(200).json({
    success: true,
    data: reply,
  });
});

// Background processing function
async function processReplyWithAI(replyId: string, text: string, question: string) {
  try {
    // Generate AI score
    const aiScore = await aiService.evaluateReply(text, question);

    // Generate summary
    const aiSummary = await aiService.generateSummary(text);

    // Update reply with AI data
    const reply = await Reply.findByIdAndUpdate(
      replyId,
      { aiScore, aiSummary },
      { new: true }
    );

    if (!reply) return;

    // Store embedding for semantic search
    await vectorService.storeEmbedding(text, {
      contentType: 'reply',
      contentId: replyId,
      userId: reply.userId.toString(),
      text: text,
    });

    console.log(`✅ AI processing completed for reply ${replyId}`);
  } catch (error) {
    console.error(`❌ AI processing failed for reply ${replyId}:`, error);
  }
}

