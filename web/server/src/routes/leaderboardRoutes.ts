import { Router } from 'express';
import {
  getLeaderboard,
  getTopExplainers,
  getClarityChampions,
  getBestVoiceExplainers,
  getUserRank,
} from '../controllers/leaderboardController';

const router = Router();

router.get('/', getLeaderboard);
router.get('/top-explainers', getTopExplainers);
router.get('/clarity-champions', getClarityChampions);
router.get('/voice-experts', getBestVoiceExplainers);
router.get('/rank/:userId', getUserRank);

export default router;

