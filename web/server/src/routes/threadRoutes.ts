import { Router } from 'express';
import {
  createThread,
  getThread,
  getAllThreads,
  updateThread,
  deleteThread,
  upvoteThread,
  searchThreads,
  getTrendingThreads,
} from '../controllers/threadController';
import { validate, threadSchema } from '../middleware/validation';

const router = Router();

router.post('/', validate(threadSchema), createThread);
router.get('/', getAllThreads);
router.get('/search', searchThreads);
router.get('/trending', getTrendingThreads);
router.get('/:id', getThread);
router.put('/:id', updateThread);
router.delete('/:id', deleteThread);
router.post('/:id/upvote', upvoteThread);

export default router;

