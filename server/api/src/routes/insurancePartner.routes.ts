import { Router } from 'express';
import {
  getInsurancePartners,
  getInsurancePartner,
  createInsurancePartner,
  updateInsurancePartner,
  deleteInsurancePartner,
} from '../controllers/insurancePartner.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.route('/').get(getInsurancePartners);
router.route('/:id').get(getInsurancePartner);

// Protected admin routes
router.use(protect);

router.route('/').post(createInsurancePartner);
router.route('/:id').put(updateInsurancePartner).patch(updateInsurancePartner).delete(deleteInsurancePartner);

export default router;
