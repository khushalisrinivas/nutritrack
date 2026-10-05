import { Router } from 'express';
import {
  getFoods,
  getFoodEntryById,
  createFood,
  quickAdd,
  updateFood,
  deleteFood,
  searchCatalog,
} from '../controllers/foodController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/search', searchCatalog);
router.post('/quick-add', quickAdd);

router.get('/', getFoods);
router.post('/', createFood);
router.get('/:id', getFoodEntryById);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;
