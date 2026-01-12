export function checkRole(...allowedRoles) {
    return (req, res, next) => {
      if (!req.admin) {
        return res.status(401).json({ error: 'Non authentifié' });
      }
  
      if (!allowedRoles.includes(req.admin.role)) {
        return res.status(403).json({ error: 'Accès refusé pour ce rôle' });
      }
  
      next();
    };
  }