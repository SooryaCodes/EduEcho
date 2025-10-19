import OpenAI from 'openai';

// Debug environment variables
console.log('🔍 OpenAI Config Debug:');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('OPENAI_API_KEY first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'undefined');

// Try to load API key with fallbacks
let apiKey = process.env.OPENAI_API_KEY;

// If still using placeholder, try to reload from .env
if (!apiKey || apiKey === 'sk-placeholder') {
  console.warn('⚠️  API key not loaded properly, trying manual load...');
  const fs = require('fs');
  try {
    const envContent = fs.readFileSync('./.env', 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('OPENAI_API_KEY=')) {
        apiKey = line.split('=')[1];
        process.env.OPENAI_API_KEY = apiKey;
        console.log('✅ Manually loaded API key from .env');
        break;
      }
    }
  } catch (error) {
    console.error('❌ Failed to manually load API key:', error);
  }
}

// Final fallback
if (!apiKey || apiKey === 'sk-placeholder') {
  apiKey = 'sk-placeholder';
  console.warn('⚠️  OPENAI_API_KEY not set. AI features will not work until configured.');
} else {
  console.log('✅ OPENAI_API_KEY loaded successfully');
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
