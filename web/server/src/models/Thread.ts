import mongoose, { Schema, Document } from 'mongoose';

export interface IThread extends Document {
  question: string;
  description?: string;
  tags: string[];
  subject: string;
  userId: mongoose.Types.ObjectId;
  language: string;
  viewCount: number;
  replyCount: number;
  upvotes: number;
  isPinned: boolean;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      minlength: [10, 'Question must be at least 10 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(tags: string[]) {
          return tags.length <= 5;
        },
        message: 'Maximum 5 tags allowed',
      },
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    language: {
      type: String,
      default: 'en',
      lowercase: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ThreadSchema.index({ subject: 1, createdAt: -1 });
ThreadSchema.index({ tags: 1 });
ThreadSchema.index({ isPinned: -1, createdAt: -1 });
ThreadSchema.index({ upvotes: -1 });
ThreadSchema.index({ viewCount: -1 });

// Text index for search
ThreadSchema.index({ question: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IThread>('Thread', ThreadSchema);

