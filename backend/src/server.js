import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './config/database.js';
import { testEmailConnection } from './config/email.js';
import { errorHandler } from './middleware/errorHandler.js';
import {
  helmetConfig,
  globalLimiter,
  hppProtection,
  sanitizeInput,
  securityLogger
} from './middleware/security.js';

import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import brandRoutes from './routes/brands.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de sécurité (doivent être en premier)
app.use(helmetConfig);
app.use(securityLogger);

// CORS sécurisé
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting global
app.use(globalLimiter);

// Protection HPP (HTTP Parameter Pollution)
app.use(hppProtection);

// Body parsers
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization des entrées
app.use(sanitizeInput);

app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API E-commerce en ligne',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Impossible de démarrer le serveur sans connexion BDD');
      process.exit(1);
    }
    
    await testEmailConnection();
    
    app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(50));
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 URL API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();