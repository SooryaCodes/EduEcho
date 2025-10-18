import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

// Common validation schemas
export const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  avatar: Joi.string().uri().optional(),
  type: Joi.string().valid('QuickLearner', 'FullMark', 'Average', 'Beginner').optional(),
  language: Joi.string().length(2).lowercase().optional(),
});

export const threadSchema = Joi.object({
  question: Joi.string().min(10).max(500).required(),
  description: Joi.string().max(2000).allow('').optional(),
  tags: Joi.array().items(Joi.string()).max(5).optional().default([]),
  subject: Joi.string().required(),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  userName: Joi.string().optional(),
  voiceUrl: Joi.string().uri().allow('').optional(),
  language: Joi.string().length(2).lowercase().optional(),
});

export const replySchema = Joi.object({
  threadId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  text: Joi.string().min(10).max(5000).required(),
  isVoiceReply: Joi.boolean().optional(),
  language: Joi.string().length(2).lowercase().optional(),
});

export const notebookSchema = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  subject: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublic: Joi.boolean().optional(),
});

export const noteSchema = Joi.object({
  content: Joi.string().max(5000).required(),
  summary: Joi.string().max(500).optional(),
  sourceType: Joi.string().valid('reply', 'manual').required(),
  sourceId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});

