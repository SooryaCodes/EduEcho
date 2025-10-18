import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || 'sk-placeholder';

if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set. AI features will not work until configured.');
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export const OPENAI_CONFIG = {
  WHISPER_MODEL: 'whisper-1',
  GPT_MODEL: 'gpt-4-turbo-preview',
  EMBEDDING_MODEL: 'text-embedding-3-small',
  TTS_MODEL: 'tts-1',
  TTS_VOICE: 'alloy' as const,
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.7,
};
