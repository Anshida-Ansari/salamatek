import { Router } from 'express';
import {
  getContactSettings,
  updateContactSettings,
} from '../controllers/contactSetting.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public route to get contact settings
router.get('/', getContactSettings);

// Admin-protected route to update global contact settings
router.use(protect);
router.put('/', updateContactSettings);
router.patch('/', updateContactSettings);

export default router;
