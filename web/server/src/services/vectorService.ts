import { getPineconeClient, PINECONE_CONFIG } from '../config/pinecone';
import aiService from './aiService';
import { v4 as uuidv4 } from 'uuid';

export interface VectorMetadata {
  contentType: 'thread' | 'reply' | 'notebook' | 'note';
  contentId: string;
  userId?: string;
  subject?: string;
  tags?: string[];
  language?: string;
  text: string;
  [key: string]: any;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: VectorMetadata;
}

export class VectorService {
  /**
   * Store a vector embedding in Pinecone
   */
  async storeEmbedding(text: string, metadata: VectorMetadata): Promise<string> {
    try { 
      const embedding = await aiService.generateEmbedding(text);
      const vectorId = uuidv4();

      const pinecone = getPineconeClient();
      const index = pinecone.index(PINECONE_CONFIG.INDEX_NAME);

      await index.upsert([
        {
          id: vectorId,
          values: embedding,
          metadata: {
            ...metadata,
            text: text.substring(0, 1000), // Store first 1000 chars in metadata
          },
        },
      ]);

      return vectorId;
    } catch (error) {
      console.error('Vector storage error:', error);
      throw new Error('Failed to store vector embedding');
    }
  }

  /**
   * Search for similar vectors
   */
  async searchSimilar(
    query: string,
    filters?: Record<string, any>,
    topK: number = PINECONE_CONFIG.TOP_K
  ): Promise<SearchResult[]> {
    try {
      const embedding = await aiService.generateEmbedding(query);

      const pinecone = getPineconeClient();
      const index = pinecone.index(PINECONE_CONFIG.INDEX_NAME);

      const queryOptions: any = {
        vector: embedding,
        topK,
        includeMetadata: true,
      };

      if (filters) {
        queryOptions.filter = filters;
      }

      const results = await index.query(queryOptions);

      return results.matches?.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata as VectorMetadata,
      })) || [];
    } catch (error) {
      console.error('Vector search error:', error);
      throw new Error('Failed to search vectors');
    }
  }

  /**
   * Delete a vector from Pinecone
   */
  async deleteVector(vectorId: string): Promise<void> {
    try {
      const pinecone = getPineconeClient();
      const index = pinecone.index(PINECONE_CONFIG.INDEX_NAME);

      await index.deleteOne(vectorId);
    } catch (error) {
      console.error('Vector deletion error:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Delete multiple vectors by filter
   */
  async deleteByFilter(filters: Record<string, any>): Promise<void> {
    try {
      const pinecone = getPineconeClient();
      const index = pinecone.index(PINECONE_CONFIG.INDEX_NAME);

      await index.deleteMany(filters);
    } catch (error) {
      console.error('Batch vector deletion error:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Update vector metadata
   */
  async updateMetadata(vectorId: string, metadata: Partial<VectorMetadata>): Promise<void> {
    try {
      const pinecone = getPineconeClient();
      const index = pinecone.index(PINECONE_CONFIG.INDEX_NAME);

      await index.update({
        id: vectorId,
        metadata,
      });
    } catch (error) {
      console.error('Vector metadata update error:', error);
      throw new Error('Failed to update vector metadata');
    }
  }
}

export default new VectorService();

