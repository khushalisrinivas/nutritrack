import { Router } from 'express';
import { getDailyAnalytics, getWeeklyAnalytics } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/daily', getDailyAnalytics);
router.get('/weekly', getWeeklyAnalytics);

export default router;
