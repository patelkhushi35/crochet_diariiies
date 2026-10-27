import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, authController.updatePassword);

router.post('/send-otp', [
  body('email').isEmail().withMessage('Valid email is required')
], authController.sendOTP);

router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid OTP is required')
], authController.verifyOTP);

router.post('/addresses', protect, authController.addAddress);
router.put('/addresses/:id', protect, authController.updateAddress);
router.delete('/addresses/:id', protect, authController.deleteAddress);

router.post('/wishlist/:productId', protect, authController.toggleWishlist);

export default router;