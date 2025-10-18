import { Router } from 'express';
import { semanticSearch, searchAll } from '../controllers/searchController';

const router = Router();

router.get('/semantic', semanticSearch);
router.post('/semantic', semanticSearch);
router.get('/all', searchAll);
router.post('/all', searchAll);

export default router;

