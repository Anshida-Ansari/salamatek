import { Router } from 'express';
import {
  getJobApplications,
  getJobApplicationById,
  createJobApplication,
  updateJobApplicationStatus,
  deleteJobApplication,
} from '../controllers/jobApplication.controller';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/auth.middleware';
import {
  createJobApplicationSchema,
  updateJobApplicationStatusSchema,
  getByIdSchema,
  listSchema,
} from '../validations/phase7.validation';

const router = Router();

// Public can create an application
router
  .route('/')
  .post(validate(createJobApplicationSchema), createJobApplication);

// Admin can view and manage applications
router.use(protect);

router.get('/', validate(listSchema), getJobApplications);

router
  .route('/:id')
  .get(validate(getByIdSchema), getJobApplicationById)
  .patch(validate(updateJobApplicationStatusSchema), updateJobApplicationStatus)
  .delete(validate(getByIdSchema), deleteJobApplication);

export default router;
