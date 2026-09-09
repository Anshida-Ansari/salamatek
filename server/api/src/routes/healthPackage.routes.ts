import { Router } from 'express';
import {
  getHealthPackages,
  getHealthPackageById,
  getHealthPackageBySlug,
  createHealthPackage,
  updateHealthPackage,
  deleteHealthPackage,
} from '../controllers/healthPackage.controller';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/auth.middleware';
import {
  createHealthPackageSchema,
  updateHealthPackageSchema,
  getByIdSchema,
  listSchema,
} from '../validations/phase7.validation';

const router = Router();

router.get('/slug/:slug', getHealthPackageBySlug);

router
  .route('/')
  .get(validate(listSchema), getHealthPackages)
  .post(protect, validate(createHealthPackageSchema), createHealthPackage);

router
  .route('/:id')
  .get(validate(getByIdSchema), getHealthPackageById)
  .patch(protect, validate(updateHealthPackageSchema), updateHealthPackage)
  .delete(protect, validate(getByIdSchema), deleteHealthPackage);

export default router;
