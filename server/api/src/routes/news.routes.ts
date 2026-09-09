import { Router } from 'express';
import {
  getNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/news.controller';
import { validate } from '../middlewares/validate';
import { protect } from '../middlewares/auth.middleware';
import {
  createNewsSchema,
  updateNewsSchema,
  getByIdSchema,
  listSchema,
} from '../validations/phase7.validation';

const router = Router();

router.get('/slug/:slug', getNewsBySlug);

router
  .route('/')
  .get(validate(listSchema), getNews)
  .post(protect, validate(createNewsSchema), createNews);

router
  .route('/:id')
  .get(validate(getByIdSchema), getNewsById)
  .patch(protect, validate(updateNewsSchema), updateNews)
  .delete(protect, validate(getByIdSchema), deleteNews);

export default router;
