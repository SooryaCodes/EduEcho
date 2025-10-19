import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import vectorService from '../services/vectorService';
import Thread from '../models/Thread';
import Reply from '../models/Reply';
import Notebook from '../models/Notebook';

export const semanticSearch = asyncHandler(async (req: Request, res: Response) => {
  // Support both GET (query) and POST (body) requests
  const { q, type, subject, limit = 10 } = req.method === 'POST' ? req.body : req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }

  // Build filters
  const filters: any = {};
  if (type) {
    filters.contentType = type;
  }
  if (subject) {
    filters.subject = subject;
  }

  // Perform semantic search with fallback
  let results = [];
  try {
    results = await vectorService.searchSimilar(q, filters, Number(limit));
  } catch (error) {
    console.warn('Vector search failed, using text search fallback:', error);
    // Fallback to text search if vector search fails
    results = [];
  }

  // If vector search returned results, process them
  let enrichedResults = [];
  
  if (results.length > 0) {
    enrichedResults = await Promise.all(
      results.map(async (result) => {
        let content = null;

        switch (result.metadata.contentType) {
          case 'thread':
            content = await Thread.findById(result.metadata.contentId).populate('userId', 'name avatar');
            break;
          case 'reply':
            content = await Reply.findById(result.metadata.contentId).populate('userId', 'name avatar');
            break;
          case 'notebook':
            content = await Notebook.findById(result.metadata.contentId).populate('userId', 'name avatar');
            break;
        }

        return {
          score: result.score,
          type: result.metadata.contentType,
          content,
        };
      })
    );
  } else {
    // Fallback to text-based search
    const [threads, replies, notebooks] = await Promise.all([
      Thread.find({ 
        $or: [
          { question: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ]
      })
      .populate('userId', 'name avatar')
      .limit(Number(limit) / 3),

      Reply.find({ text: new RegExp(q, 'i') })
      .populate('userId', 'name avatar')
      .limit(Number(limit) / 3),

      Notebook.find({
        $or: [
          { title: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
        ],
        isPublic: true,
      })
      .populate('userId', 'name avatar')
      .limit(Number(limit) / 3),
    ]);

    enrichedResults = [
      ...threads.map(thread => ({ score: 0.8, type: 'thread', content: thread })),
      ...replies.map(reply => ({ score: 0.7, type: 'reply', content: reply })),
      ...notebooks.map(notebook => ({ score: 0.6, type: 'notebook', content: notebook })),
    ];
  }

  res.status(200).json({
    success: true,
    data: enrichedResults.filter((r) => r.content !== null),
  });
});

export const searchAll = asyncHandler(async (req: Request, res: Response) => {
  // Support both GET (query) and POST (body) requests
  const { q } = req.method === 'POST' ? req.body : req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Search query is required',
    });
  }

  // Search across all content types
  const [threads, replies, notebooks] = await Promise.all([
    Thread.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(5)
      .populate('userId', 'name avatar'),

    Reply.find({ text: new RegExp(q, 'i') })
      .limit(5)
      .populate('userId', 'name avatar'),

    Notebook.find({
      $or: [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ],
      isPublic: true,
    })
      .limit(5)
      .populate('userId', 'name avatar'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      threads,
      replies,
      notebooks,
    },
  });
});

