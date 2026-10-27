import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.post('/verify-payment', protect, orderController.verifyPayment);

// Admin routes
router.get('/', protect, authorize('admin'), orderController.getAllOrders);
router.get('/stats', protect, authorize('admin'), orderController.getOrderStats);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

router.get('/:id', protect, orderController.getOrder);
router.delete('/:id', protect, orderController.cancelOrder);

export default router;