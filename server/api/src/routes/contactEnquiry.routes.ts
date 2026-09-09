import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/contactEnquiry.controller';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// Public route for form submission
router.post('/', createEnquiry);

// Protected Admin Routes
router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getEnquiries);

router.route('/:id')
  .get(getEnquiryById)
  .patch(updateEnquiryStatus)
  .delete(deleteEnquiry);

export default router;
