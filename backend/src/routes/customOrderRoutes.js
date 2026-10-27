import express from 'express';
import * as customOrderController from '../controllers/customOrderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Customer routes
router.post('/', customOrderController.createCustomOrder);
router.get('/my-requests', protect, customOrderController.getMyCustomOrders);
router.get('/:id', protect, customOrderController.getCustomOrder);

// Admin routes
router.get('/', protect, authorize('admin'), customOrderController.getMyCustomOrders);
router.put('/:id/status', protect, authorize('admin'), customOrderController.updateCustomOrderStatus);
router.put('/:id/note', protect, authorize('admin'), customOrderController.addAdminNote);
router.delete('/:id', protect, authorize('admin'), customOrderController.deleteCustomOrder);

export default router;