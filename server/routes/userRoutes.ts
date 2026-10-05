import { Router } from 'express';
import { getProfile, updateProfile, updateGoals } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/goals', updateGoals);

export default router;
