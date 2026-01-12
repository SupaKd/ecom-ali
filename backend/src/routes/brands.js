import express from 'express';
import * as brandController from '../controllers/brandController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrandById);
router.get('/slug/:slug', brandController.getBrandBySlug);

router.post(
  '/',
  authenticateToken,
  checkRole('product_manager'),
  brandController.createBrand
);

router.put(
  '/:id',
  authenticateToken,
  checkRole('product_manager'),
  brandController.updateBrand
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole('product_manager'),
  brandController.deleteBrand
);

export default router;