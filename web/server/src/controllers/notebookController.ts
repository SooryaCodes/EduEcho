import { Request, Response, NextFunction } from 'express';
import Notebook from '../models/Notebook';
import User from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import aiService from '../services/aiService';
import vectorService from '../services/vectorService';

export const createNotebook = asyncHandler(async (req: Request, res: Response) => {
  const notebook = await Notebook.create(req.body);

  res.status(201).json({
    success: true,
    data: notebook,
  });
});

export const getNotebook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const notebook = await Notebook.findById(req.params.id).populate('userId', 'name avatar');

  if (!notebook) {
    return next(new AppError('Notebook not found', 404));
  }

  res.status(200).json({
    success: true,
    data: notebook,
  });
});

export const getUserNotebooks = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const notebooks = await Notebook.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Notebook.countDocuments({ userId });

  res.status(200).json({
    success: true,
    data: notebooks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getPublicNotebooks = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, subject, sortBy = 'importCount' } = req.query;

  const query: any = { isPublic: true };
  if (subject) {
    query.subject = subject;
  }

  const notebooks = await Notebook.find(query)
    .populate('userId', 'name avatar')
    .sort({ [sortBy as string]: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await Notebook.countDocuments(query);

  res.status(200).json({
    success: true,
    data: notebooks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const updateNotebook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const notebook = await Notebook.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!notebook) {
    return next(new AppError('Notebook not found', 404));
  }

  res.status(200).json({
    success: true,
    data: notebook,
  });
});

export const deleteNotebook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const notebook = await Notebook.findByIdAndDelete(req.params.id);

  if (!notebook) {
    return next(new AppError('Notebook not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Notebook deleted successfully',
  });
});

export const addNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { content, sourceType, sourceId } = req.body;

  const notebook = await Notebook.findById(id);
  if (!notebook) {
    return next(new AppError('Notebook not found', 404));
  }

  // Generate summary if not provided
  let summary = req.body.summary;
  if (!summary) {
    summary = await aiService.generateSummary(content);
  }

  const note = {
    content,
    summary,
    sourceType,
    sourceId,
    flashcards: [],
    createdAt: new Date(),
  };

  notebook.notes.push(note as any);
  await notebook.save();

  // Store embedding for semantic search
  try {
    await vectorService.storeEmbedding(content, {
      contentType: 'note',
      contentId: notebook._id.toString(),
      userId: notebook.userId.toString(),
      text: content,
    });
  } catch (error) {
    console.error('Failed to store note embedding:', error);
  }

  res.status(201).json({
    success: true,
    data: notebook,
  });
});

export const generateFlashcards = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id, noteId } = req.params;
  const { count = 5 } = req.body;

  const notebook = await Notebook.findById(id);
  if (!notebook) {
    return next(new AppError('Notebook not found', 404));
  }

  const note = notebook.notes.id(noteId);
  if (!note) {
    return next(new AppError('Note not found', 404));
  }

  // Generate flashcards using AI
  const flashcards = await aiService.generateFlashcards(note.content, count);

  note.flashcards = flashcards as any;
  await notebook.save();

  res.status(200).json({
    success: true,
    data: flashcards,
  });
});

export const importNotebook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.body;

  const originalNotebook = await Notebook.findById(id);
  if (!originalNotebook) {
    return next(new AppError('Notebook not found', 404));
  }

  if (!originalNotebook.isPublic) {
    return next(new AppError('This notebook is not public', 403));
  }

  // Create a copy for the user
  const newNotebook = await Notebook.create({
    userId,
    title: `${originalNotebook.title} (Imported)`,
    description: originalNotebook.description,
    subject: originalNotebook.subject,
    tags: originalNotebook.tags,
    notes: originalNotebook.notes,
    isPublic: false,
  });

  // Increment import count
  await Notebook.findByIdAndUpdate(id, { $inc: { importCount: 1 } });

  // Update user stats
  await User.findByIdAndUpdate(userId, { $inc: { notebooksSaved: 1 } });

  res.status(201).json({
    success: true,
    data: newNotebook,
  });
});

