import { Router } from 'express';
import {
  createReply,
  getRepliesByThread,
  getReply,
  updateReply,
  deleteReply,
  upvoteReply,
  downvoteReply,
  markBestAnswer,
} from '../controllers/replyController';
import { validate, replySchema } from '../middleware/validation';

const router = Router();

router.post('/', validate(replySchema), createReply);
router.get('/thread/:threadId', getRepliesByThread);
router.get('/:id', getReply);
router.put('/:id', updateReply);
router.delete('/:id', deleteReply);
router.post('/:id/upvote', upvoteReply);
router.post('/:id/downvote', downvoteReply);
router.post('/:id/best-answer', markBestAnswer);

export default router;

