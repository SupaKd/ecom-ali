import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/similar/:brandId/:productId', productController.getSimilarProducts);

router.post(
  '/',
  authenticateToken,
  checkRole('product_manager'),
  upload.single('image'),
  productController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  checkRole('product_manager'),
  upload.single('image'),
  productController.updateProduct
);

router.patch(
  '/:id/stock',
  authenticateToken,
  checkRole('order_manager', 'product_manager'),
  productController.updateProductStock
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole('product_manager'),
  productController.deleteProduct
);

export default router;