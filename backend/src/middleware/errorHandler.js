export function errorHandler(err, req, res, next) {
  // Logger l'erreur pour le débogage (avec plus de détails)
  console.error('🔴 Erreur capturée:', {
    message: err.message,
    status: err.status,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });

  // Déterminer le statut HTTP
  const status = err.status || err.statusCode || 500;

  // Messages d'erreur sécurisés (ne pas exposer les détails en production)
  let message = err.message || 'Erreur serveur interne';

  // En production, masquer les erreurs internes
  if (process.env.NODE_ENV === 'production' && status === 500) {
    message = 'Une erreur est survenue. Veuillez réessayer plus tard.';
  }

  // Réponse sécurisée
  const response = {
    error: message,
    status: status
  };

  // Ajouter la stack uniquement en développement
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err.details || null;
  }

  res.status(status).json(response);
}