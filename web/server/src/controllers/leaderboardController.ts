import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import User from '../models/User';
import Reply from '../models/Reply';

export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, period = 'all' } = req.query;

  let dateFilter = {};
  
  if (period === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = { createdAt: { $gte: weekAgo } };
  } else if (period === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateFilter = { createdAt: { $gte: monthAgo } };
  }

  const leaderboard = await User.find(dateFilter)
    .sort({ points: -1, upvotesReceived: -1 })
    .limit(Number(limit))
    .select('name avatar type points contributionCount upvotesReceived');

  res.status(200).json({
    success: true,
    data: leaderboard,
  });
});

export const getTopExplainers = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20 } = req.query;

  // Get users with highest average AI scores
  const topExplainers = await Reply.aggregate([
    {
      $match: {
        'aiScore.overallScore': { $exists: true },
      },
    },
    {
      $group: {
        _id: '$userId',
        avgScore: { $avg: '$aiScore.overallScore' },
        replyCount: { $sum: 1 },
        totalUpvotes: { $sum: '$upvotes' },
      },
    },
    {
      $match: {
        replyCount: { $gte: 5 }, // Minimum 5 replies
      },
    },
    {
      $sort: { avgScore: -1 },
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 1,
        name: '$user.name',
        avatar: '$user.avatar',
        type: '$user.type',
        avgScore: 1,
        replyCount: 1,
        totalUpvotes: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: topExplainers,
  });
});

export const getClarityChampions = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20 } = req.query;

  // Get users with highest clarity scores
  const champions = await Reply.aggregate([
    {
      $match: {
        'aiScore.clarity': { $exists: true },
      },
    },
    {
      $group: {
        _id: '$userId',
        avgClarity: { $avg: '$aiScore.clarity' },
        replyCount: { $sum: 1 },
      },
    },
    {
      $match: {
        replyCount: { $gte: 5 },
      },
    },
    {
      $sort: { avgClarity: -1 },
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 1,
        name: '$user.name',
        avatar: '$user.avatar',
        avgClarity: 1,
        replyCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: champions,
  });
});

export const getBestVoiceExplainers = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20 } = req.query;

  // Get users with best voice explanations
  const voiceExperts = await Reply.aggregate([
    {
      $match: {
        isVoiceReply: true,
        'aiScore.confidence': { $exists: true },
      },
    },
    {
      $group: {
        _id: '$userId',
        avgConfidence: { $avg: '$aiScore.confidence' },
        avgScore: { $avg: '$aiScore.overallScore' },
        voiceReplyCount: { $sum: 1 },
      },
    },
    {
      $match: {
        voiceReplyCount: { $gte: 3 },
      },
    },
    {
      $sort: { avgScore: -1, avgConfidence: -1 },
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 1,
        name: '$user.name',
        avatar: '$user.avatar',
        avgConfidence: 1,
        avgScore: 1,
        voiceReplyCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: voiceExperts,
  });
});

export const getUserRank = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Find user's rank
  const rank = await User.countDocuments({
    points: { $gt: user.points },
  }) + 1;

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      rank,
      total,
      points: user.points,
      percentile: Math.round((1 - (rank / total)) * 100),
    },
  });
});

