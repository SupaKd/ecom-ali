import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', paymentController.createCheckout);
router.get('/verify/:sessionId', paymentController.verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router;