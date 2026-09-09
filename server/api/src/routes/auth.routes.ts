import { Router } from 'express';
import { loginAdmin, getMe, createInitialAdmin } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validations/auth.validation';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', validate(loginSchema), loginAdmin);
router.get('/me', protect, getMe);
router.post('/setup', createInitialAdmin); // Temporary for creating first user

export default router;
