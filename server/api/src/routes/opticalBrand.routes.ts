import { Router } from 'express';
import {
  getOpticalBrands,
  getOpticalBrand,
  createOpticalBrand,
  updateOpticalBrand,
  deleteOpticalBrand,
} from '../controllers/opticalBrand.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.route('/').get(getOpticalBrands);
router.route('/:id').get(getOpticalBrand);

// Protected admin routes
router.use(protect);

router.route('/').post(createOpticalBrand);
router.route('/:id').put(updateOpticalBrand).patch(updateOpticalBrand).delete(deleteOpticalBrand);

export default router;
