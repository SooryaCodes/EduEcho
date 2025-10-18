import mongoose, { Schema, Document } from 'mongoose';

export interface IEmbedding extends Document {
  vectorId: string; // Pinecone vector ID
  contentType: 'thread' | 'reply' | 'notebook' | 'note';
  contentId: mongoose.Types.ObjectId;
  text: string; // Original text that was embedded
  metadata: {
    userId?: mongoose.Types.ObjectId;
    subject?: string;
    tags?: string[];
    language?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddingSchema: Schema = new Schema(
  {
    vectorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: ['thread', 'reply', 'notebook', 'note'],
      required: true,
      index: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
EmbeddingSchema.index({ contentType: 1, contentId: 1 });

export default mongoose.model<IEmbedding>('Embedding', EmbeddingSchema);

