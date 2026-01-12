import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

// Configuration de Helmet pour sécuriser les headers HTTP
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Rate limiting global pour toutes les routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting strict pour les routes d'authentification
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 tentatives de connexion
  message: { error: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte pas les tentatives réussies
});

// Rate limiting pour les uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 uploads
  message: { error: 'Trop d\'uploads, veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Protection contre les attaques HTTP Parameter Pollution
export const hppProtection = hpp();

// Middleware de sanitization des données
export const sanitizeInput = (req, res, next) => {
  // Nettoyer les données des injections potentielles
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Supprimer les balises HTML dangereuses
        req.body[key] = req.body[key].replace(/<script[^>]*>.*?<\/script>/gi, '');
        req.body[key] = req.body[key].replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
        req.body[key] = req.body[key].replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
      }
    });
  }
  next();
};

// Middleware pour logger les tentatives suspectes
export const securityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL injection
    /(\<script\>)|(\<\/script\>)/i,   // XSS
    /(\.\.\/)/i,                       // Path traversal
  ];

  const url = req.originalUrl || req.url;
  const body = JSON.stringify(req.body);

  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(url) || pattern.test(body)) {
      console.warn(`🚨 Tentative suspecte détectée:`, {
        ip: req.ip,
        url: url,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    }
  });

  next();
};
