import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient: Pinecone | null = null;

export const initializePinecone = async (): Promise<Pinecone> => {
  try {
    const apiKey = process.env.PINECONE_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  PINECONE_API_KEY not set. Semantic search will not work.');
      return null as any;
    }

    pineconeClient = new Pinecone({
      apiKey: apiKey,
    });

    console.log('✅ Pinecone initialized successfully');
    return pineconeClient;

  } catch (error) {
    console.error('❌ Pinecone initialization failed:', error);
    return null as any;
  }
};

export const getPineconeClient = (): Pinecone => {
  if (!pineconeClient) {
    throw new Error('Pinecone client not initialized. Call initializePinecone first.');
  }
  return pineconeClient;
};

export const PINECONE_CONFIG = {
  INDEX_NAME: process.env.PINECONE_INDEX_NAME || 'eduecho-embeddings',
  DIMENSION: 1536, // text-embedding-3-small dimension
  METRIC: 'cosine' as const,
  TOP_K: 10, // Number of results to return
};

