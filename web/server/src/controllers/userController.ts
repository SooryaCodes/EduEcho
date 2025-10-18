import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, type, sortBy = 'createdAt' } = req.query;

  const query: any = {};
  if (type) {
    query.type = type;
  }

  const users = await User.find(query)
    .sort({ [sortBy as string]: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const getUserStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      points: user.points,
      contributionCount: user.contributionCount,
      upvotesReceived: user.upvotesReceived,
      notebooksSaved: user.notebooksSaved,
    },
  });
});

