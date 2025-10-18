import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  type: 'QuickLearner' | 'FullMark' | 'Average' | 'Beginner';
  language: string;
  points: number;
  contributionCount: number;
  upvotesReceived: number;
  notebooksSaved: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    avatar: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ['QuickLearner', 'FullMark', 'Average', 'Beginner'],
      default: 'Average',
    },
    language: {
      type: String,
      default: 'en',
      lowercase: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    contributionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvotesReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    notebooksSaved: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ points: -1 });
UserSchema.index({ type: 1 });
UserSchema.index({ createdAt: -1 });

export default mongoose.model<IUser>('User', UserSchema);

