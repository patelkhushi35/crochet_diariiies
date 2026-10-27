import express from 'express';
import * as galleryController from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', galleryController.getGallery);
router.get('/instagram', galleryController.getInstagramFeed);

router.put('/reorder', protect, authorize('admin'), galleryController.reorderGallery);
router.post('/', protect, authorize('admin'), upload.array('images', 20), galleryController.createGalleryImage);
router.put('/:id', protect, authorize('admin'), upload.array('images', 20), galleryController.updateGalleryImage);
router.delete('/:id', protect, authorize('admin'), galleryController.deleteGalleryImage);

export default router;