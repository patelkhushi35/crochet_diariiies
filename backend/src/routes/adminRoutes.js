import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), adminController.getDashboardStats);
router.get('/users', protect, authorize('admin'), adminController.getUsers);
router.get('/users/:id', protect, authorize('admin'), adminController.getUser);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

export default router;