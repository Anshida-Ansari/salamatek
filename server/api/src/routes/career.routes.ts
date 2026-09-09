import { Router } from 'express';
import {
  getCareers,
  getCareerById,
  getCareerBySlug,
  createCareer,
  updateCareer,
  deleteCareer,
} from '../controllers/career.controller';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/auth.middleware';
import {
  createCareerSchema,
  updateCareerSchema,
  getByIdSchema,
  listSchema,
} from '../validations/phase7.validation';

const router = Router();

router.get('/slug/:slug', getCareerBySlug);

router
  .route('/')
  .get(validate(listSchema), getCareers)
  .post(protect, validate(createCareerSchema), createCareer);

router
  .route('/:id')
  .get(validate(getByIdSchema), getCareerById)
  .patch(protect, validate(updateCareerSchema), updateCareer)
  .delete(protect, validate(getByIdSchema), deleteCareer);

export default router;
