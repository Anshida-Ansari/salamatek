import { Router } from 'express';
import { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { validate } from '../middlewares/validate';
import { protect, authorize } from '../middlewares/auth.middleware';
import { createTestimonialSchema, updateTestimonialSchema, getTestimonialSchema, listTestimonialsSchema } from '../validations/testimonial.validation';

const router = Router();

router
  .route('/')
  .get(validate(listTestimonialsSchema), getTestimonials)
  .post(protect, authorize('admin'), validate(createTestimonialSchema), createTestimonial);

router
  .route('/:id')
  .get(validate(getTestimonialSchema), getTestimonialById)
  .patch(protect, authorize('admin'), validate(updateTestimonialSchema), updateTestimonial)
  .delete(protect, authorize('admin'), validate(getTestimonialSchema), deleteTestimonial);

export default router;
