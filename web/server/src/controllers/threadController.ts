import { Request, Response, NextFunction } from 'express';
import Thread from '../models/Thread';
import User from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import vectorService from '../services/vectorService';

export const createThread = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const thread = await Thread.create(req.body);

  // Update user contribution count
  await User.findByIdAndUpdate(req.body.userId, {
    $inc: { contributionCount: 1, points: 5 },
  });

  // Store embedding for semantic search
  try {
    const textToEmbed = `${thread.question} ${thread.description || ''} ${thread.tags.join(' ')}`;
    await vectorService.storeEmbedding(textToEmbed, {
      contentType: 'thread',
      contentId: thread._id.toString(),
      userId: thread.userId.toString(),
      subject: thread.subject,
      tags: thread.tags,
      language: thread.language,
      text: textToEmbed,
    });
  } catch (error) {
    console.error('Failed to store thread embedding:', error);
  }

  res.status(201).json({
    success: true,
    data: thread,
  });
});

export const getThread = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const thread = await Thread.findById(req.params.id).populate('userId', 'name avatar type');

  if (!thread) {
    return next(new AppError('Thread not found', 404));
  }

  // Increment view count
  thread.viewCount += 1;
  await thread.save();

  res.status(200).json({
    success: true,
    data: thread,
  });
});

export const getAllThreads = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    subject,
    tags,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const query: any = {};

  if (subject) {
    query.subject = subject;
  }

  if (tags) {
    query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  }

  const sortOrder = order === 'asc' ? 1 : -1;

  const threads = await Thread.find(query)
    .populate('userId', 'name avatar type')
    .sort({ [sortBy as string]: sortOrder })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Thread.countDocuments(query);

  res.status(200).json({
    success: true,
    data: threads,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const updateThread = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const thread = await Thread.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!thread) {
    return next(new AppError('Thread not found', 404));
  }

  res.status(200).json({
    success: true,
    data: thread,
  });
});

export const deleteThread = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const thread = await Thread.findByIdAndDelete(req.params.id);

  if (!thread) {
    return next(new AppError('Thread not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Thread deleted successfully',
  });
});

export const upvoteThread = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const thread = await Thread.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );

  if (!thread) {
    return next(new AppError('Thread not found', 404));
  }

  res.status(200).json({
    success: true,
    data: thread,
  });
});

export const searchThreads = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }

  const threads = await Thread.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .populate('userId', 'name avatar type');

  res.status(200).json({
    success: true,
    data: threads,
  });
});

export const getTrendingThreads = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  // Calculate trending score based on recent views, replies, and upvotes
  const threads = await Thread.find()
    .sort({ viewCount: -1, replyCount: -1, upvotes: -1 })
    .limit(Number(limit))
    .populate('userId', 'name avatar type');

  res.status(200).json({
    success: true,
    data: threads,
  });
});

