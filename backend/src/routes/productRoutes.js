import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/best-sellers', productController.getBestSellers);
router.get('/search', productController.searchProducts);
router.get('/admin/all', protect, authorize('admin'), productController.getAllProductsAdmin);
router.post('/', protect, authorize('admin'), upload.array('images', 10), productController.createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);
router.get('/:slug', productController.getProduct);

export default router;