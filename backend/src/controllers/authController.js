import * as authService from '../services/authService.js';

// Validation email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Validation du format email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    // Validation longueur password
    if (password.length < 6 || password.length > 100) {
      return res.status(400).json({ error: 'Mot de passe invalide' });
    }

    // Validation longueur email
    if (email.length > 255) {
      return res.status(400).json({ error: 'Email trop long' });
    }

    const result = await authService.loginAdmin(email, password);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    res.json({ admin: req.admin });
  } catch (error) {
    next(error);
  }
}