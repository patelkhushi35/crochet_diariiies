import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', protect, reviewController.createReview);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

router.get('/', protect, authorize('admin'), reviewController.getAllReviews);
router.put('/:id/approve', protect, authorize('admin'), reviewController.approveReview);
router.put('/:id/reject', protect, authorize('admin'), reviewController.rejectReview);

export default router;