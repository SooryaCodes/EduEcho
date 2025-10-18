import mongoose, { Schema, Document } from 'mongoose';

export interface IAIScore {
  clarity: number;
  relevance: number;
  depth: number;
  simplicity: number;
  confidence: number;
  overallScore: number;
}

export interface IReply extends Document {
  threadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  voiceUrl?: string;
  transcript?: string;
  isVoiceReply: boolean;
  language: string;
  aiSummary?: string;
  aiScore?: IAIScore;
  summaryAudioUrl?: string;
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AIScoreSchema = new Schema({
  clarity: { type: Number, min: 0, max: 10, required: true },
  relevance: { type: Number, min: 0, max: 10, required: true },
  depth: { type: Number, min: 0, max: 10, required: true },
  simplicity: { type: Number, min: 0, max: 10, required: true },
  confidence: { type: Number, min: 0, max: 10, required: true },
  overallScore: { type: Number, min: 0, max: 10, required: true },
}, { _id: false });

const ReplySchema: Schema = new Schema(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Reply text is required'],
      trim: true,
      minlength: [10, 'Reply must be at least 10 characters'],
      maxlength: [5000, 'Reply cannot exceed 5000 characters'],
    },
    voiceUrl: {
      type: String,
      default: null,
    },
    transcript: {
      type: String,
      default: null,
    },
    isVoiceReply: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'en',
      lowercase: true,
    },
    aiSummary: {
      type: String,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    aiScore: {
      type: AIScoreSchema,
      default: null,
    },
    summaryAudioUrl: {
      type: String,
      default: null,
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isBestAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ReplySchema.index({ threadId: 1, createdAt: -1 });
ReplySchema.index({ userId: 1 });
ReplySchema.index({ 'aiScore.overallScore': -1 });
ReplySchema.index({ upvotes: -1 });

export default mongoose.model<IReply>('Reply', ReplySchema);

