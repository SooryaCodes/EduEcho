// User Types
export type UserType = 'QuickLearner' | 'FullMark' | 'Average' | 'Beginner';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  type: UserType;
  language: string;
  points: number;
  contributionCount: number;
  upvotesReceived: number;
  notebooksSaved: number;
  createdAt: string;
  updatedAt: string;
}

// Thread Types
export interface Thread {
  _id: string;
  question: string;
  description?: string;
  tags: string[];
  subject: string;
  userId: User | string;
  language: string;
  viewCount: number;
  replyCount: number;
  upvotes: number;
  isPinned: boolean;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

// AI Score Types
export interface AIScore {
  clarity: number;
  relevance: number;
  depth: number;
  simplicity: number;
  confidence: number;
  overallScore: number;
}

// Reply Types
export interface Reply {
  _id: string;
  threadId: string;
  userId: User | string;
  text: string;
  voiceUrl?: string;
  transcript?: string;
  isVoiceReply: boolean;
  language: string;
  aiSummary?: string;
  aiScore?: AIScore;
  summaryAudioUrl?: string;
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  personalizedScore?: number;
}

// Flashcard Types
export interface Flashcard {
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Note Types
export interface Note {
  _id: string;
  content: string;
  summary?: string;
  sourceType: 'reply' | 'manual';
  sourceId?: string;
  flashcards: Flashcard[];
  createdAt: string;
}

// Notebook Types
export interface Notebook {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: string;
  tags: string[];
  notes: Note[];
  isPublic: boolean;
  importCount: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Leaderboard Types
export interface LeaderboardEntry {
  _id: string;
  name: string;
  avatar?: string;
  type: UserType;
  points: number;
  contributionCount: number;
  upvotesReceived: number;
  avgScore?: number;
  avgClarity?: number;
  avgConfidence?: number;
  replyCount?: number;
  voiceReplyCount?: number;
}

// Search Types
export interface SearchResult {
  score: number;
  type: 'thread' | 'reply' | 'notebook';
  content: Thread | Reply | Notebook;
}

