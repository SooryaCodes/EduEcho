require('dotenv').config({ path: '.env' });

console.log('🔍 Environment Test:');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('OPENAI_API_KEY first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'undefined');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-placeholder') {
  console.log('✅ OpenAI API key is properly loaded!');
} else {
  console.log('❌ OpenAI API key is not loaded or is placeholder');
}
