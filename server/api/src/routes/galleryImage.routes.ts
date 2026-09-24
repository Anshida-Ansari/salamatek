import { Router } from 'express';
import {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryImage.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.route('/').get(getGalleryImages);
router.route('/:id').get(getGalleryImage);

// Protected routes (Admin only)
router.use(protect);

router.route('/').post(createGalleryImage);
router.route('/:id').put(updateGalleryImage).delete(deleteGalleryImage);

export default router;
