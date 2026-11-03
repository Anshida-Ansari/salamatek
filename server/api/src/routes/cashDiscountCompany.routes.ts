import { Router } from 'express';
import {
  getCashDiscountCompanies,
  getCashDiscountCompany,
  createCashDiscountCompany,
  updateCashDiscountCompany,
  deleteCashDiscountCompany,
} from '../controllers/cashDiscountCompany.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.route('/').get(getCashDiscountCompanies);
router.route('/:id').get(getCashDiscountCompany);

// Protected admin routes
router.use(protect);

router.route('/').post(createCashDiscountCompany);
router.route('/:id').put(updateCashDiscountCompany).patch(updateCashDiscountCompany).delete(deleteCashDiscountCompany);

export default router;

