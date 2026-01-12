import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  checkRole('order_manager'),
  orderController.getOrders
);

router.get(
  '/:id',
  authenticateToken,
  checkRole('order_manager'),
  orderController.getOrderById
);

router.get(
  '/number/:orderNumber',
  orderController.getOrderByNumber
);

router.get(
  '/email/:email',
  orderController.getOrdersByEmail
);

router.post('/', orderController.createOrder);

router.patch(
  '/:id/status',
  authenticateToken,
  checkRole('order_manager'),
  orderController.updateOrderStatus
);

export default router;