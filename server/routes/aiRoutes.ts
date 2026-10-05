import { Router } from 'express';
import { getInsights } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/insights', getInsights);

export default router;
