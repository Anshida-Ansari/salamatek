import { Router } from 'express';
import {
  getSarcEnquiries,
  getSarcEnquiryById,
  createSarcEnquiry,
  updateSarcEnquiryStatus,
  deleteSarcEnquiry,
} from '../controllers/sarcEnquiry.controller';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/auth.middleware';
import {
  createSarcEnquirySchema,
  updateSarcEnquiryStatusSchema,
  getByIdSchema,
  listSchema,
} from '../validations/phase7.validation';

const router = Router();

// Public can submit an enquiry
router
  .route('/')
  .post(validate(createSarcEnquirySchema), createSarcEnquiry);

// Admin can view and manage enquiries
router.use(protect);

router.get('/', validate(listSchema), getSarcEnquiries);

router
  .route('/:id')
  .get(validate(getByIdSchema), getSarcEnquiryById)
  .patch(validate(updateSarcEnquiryStatusSchema), updateSarcEnquiryStatus)
  .delete(validate(getByIdSchema), deleteSarcEnquiry);

export default router;
