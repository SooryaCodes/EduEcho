import { Router } from 'express';
import {
  transcribeAudio,
  analyzeVoice,
  uploadVoiceReply,
  generateSummaryAudio,
  evaluateText,
  generateSummary,
  generateFlashcardsFromText,
} from '../controllers/aiController';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/transcribe', upload.single('audio'), transcribeAudio);
router.post('/analyze-voice', upload.single('audio'), analyzeVoice);
router.post('/voice-reply', upload.single('audio'), uploadVoiceReply);
router.post('/summary-audio', generateSummaryAudio);
router.post('/evaluate', evaluateText);
router.post('/summary', generateSummary);
router.post('/flashcards', generateFlashcardsFromText);

export default router;

