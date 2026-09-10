import { Router } from 'express';
import {
  getPageHeroSettings,
  getPageHeroSettingByKey,
  updatePageHeroSetting,
} from '../controllers/pageHeroSetting.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getPageHeroSettings);
router.get('/:pageKey', getPageHeroSettingByKey);

// Admin only routes
router.use(protect);
router.patch('/:pageKey', updatePageHeroSetting);

export default router;
