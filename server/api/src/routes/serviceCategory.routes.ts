import { Router } from 'express';
import {
  getServiceCategories,
  getServiceCategoryById,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from '../controllers/serviceCategory.controller';
import { validate } from '../middlewares/validate';
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
  getServiceCategorySchema,
  listServiceCategoriesSchema,
} from '../validations/serviceCategory.validation';

const router = Router();

router
  .route('/')
  .get(validate(listServiceCategoriesSchema), getServiceCategories)
  .post(validate(createServiceCategorySchema), createServiceCategory);

router
  .route('/:id')
  .get(validate(getServiceCategorySchema), getServiceCategoryById)
  .patch(validate(updateServiceCategorySchema), updateServiceCategory)
  .delete(validate(getServiceCategorySchema), deleteServiceCategory);

export default router;
