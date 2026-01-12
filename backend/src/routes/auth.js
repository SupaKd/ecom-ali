import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Rate limiting strict sur le login pour prévenir le brute force
router.post('/login', authLimiter, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);

export default router;