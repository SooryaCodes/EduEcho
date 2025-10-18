import { Router } from 'express';
import {
  createNotebook,
  getNotebook,
  getUserNotebooks,
  getPublicNotebooks,
  updateNotebook,
  deleteNotebook,
  addNote,
  generateFlashcards,
  importNotebook,
} from '../controllers/notebookController';
import { validate, notebookSchema, noteSchema } from '../middleware/validation';

const router = Router();

router.post('/', validate(notebookSchema), createNotebook);
router.get('/public', getPublicNotebooks);
router.get('/user/:userId', getUserNotebooks);
router.get('/:id', getNotebook);
router.put('/:id', updateNotebook);
router.delete('/:id', deleteNotebook);
router.post('/:id/notes', validate(noteSchema), addNote);
router.post('/:id/notes/:noteId/flashcards', generateFlashcards);
router.post('/:id/import', importNotebook);

export default router;

