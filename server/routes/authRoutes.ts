import { Router } from 'express';
import { register, login, demoLogin } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);

export default router;
