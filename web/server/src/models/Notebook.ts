import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard {
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface INote {
  content: string;
  summary?: string;
  sourceType: 'reply' | 'manual';
  sourceId?: mongoose.Types.ObjectId;
  flashcards: IFlashcard[];
  createdAt: Date;
}

export interface INotebook extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  subject?: string;
  tags: string[];
  notes: INote[];
  isPublic: boolean;
  importCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema = new Schema({
  question: { type: String, required: true, maxlength: 300 },
  answer: { type: String, required: true, maxlength: 1000 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
}, { _id: false });

const NoteSchema = new Schema({
  content: { type: String, required: true, maxlength: 5000 },
  summary: { type: String, maxlength: 500 },
  sourceType: { type: String, enum: ['reply', 'manual'], required: true },
  sourceId: { type: Schema.Types.ObjectId, default: null },
  flashcards: { type: [FlashcardSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const NotebookSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    subject: {
      type: String,
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: [NoteSchema],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    importCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
NotebookSchema.index({ userId: 1, createdAt: -1 });
NotebookSchema.index({ isPublic: 1, importCount: -1 });
NotebookSchema.index({ subject: 1 });
NotebookSchema.index({ tags: 1 });

export default mongoose.model<INotebook>('Notebook', NotebookSchema);

