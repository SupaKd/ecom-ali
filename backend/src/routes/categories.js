import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);

router.post(
  '/',
  authenticateToken,
  checkRole('product_manager'),
  upload.single('image'),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticateToken,
  checkRole('product_manager'),
  upload.single('image'),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole('product_manager'),
  categoryController.deleteCategory
);

export default router;