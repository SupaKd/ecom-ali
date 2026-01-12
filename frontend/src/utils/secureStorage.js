/**
 * Utilitaires pour le stockage sécurisé des données sensibles
 * Note: localStorage reste vulnérable aux attaques XSS.
 * Pour une sécurité maximale en production, utiliser httpOnly cookies.
 */

const STORAGE_PREFIX = 'ecom_';
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const ADMIN_KEY = `${STORAGE_PREFIX}admin`;

/**
 * Encodage simple pour obfusquer (pas de vraie encryption côté client sans backend)
 */
function encode(data) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (error) {
    console.error('Erreur encodage:', error);
    return null;
  }
}

function decode(encodedData) {
  try {
    return JSON.parse(decodeURIComponent(atob(encodedData)));
  } catch (error) {
    console.error('Erreur décodage:', error);
    return null;
  }
}

/**
 * Stockage sécurisé
 */
export const secureStorage = {
  /**
   * Sauvegarde un token de manière obfusquée
   */
  setToken(token) {
    if (!token) return;

    try {
      const encoded = encode({ token, timestamp: Date.now() });
      if (encoded) {
        localStorage.setItem(TOKEN_KEY, encoded);
      }
    } catch (error) {
      console.error('Erreur sauvegarde token:', error);
    }
  },

  /**
   * Récupère le token
   */
  getToken() {
    try {
      const encoded = localStorage.getItem(TOKEN_KEY);
      if (!encoded) return null;

      const decoded = decode(encoded);
      if (!decoded || !decoded.token) return null;

      // Vérifier l'âge du token (24h max)
      const age = Date.now() - decoded.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures

      if (age > maxAge) {
        this.removeToken();
        return null;
      }

      return decoded.token;
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  },

  /**
   * Supprime le token
   */
  removeToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur suppression token:', error);
    }
  },

  /**
   * Sauvegarde les données admin
   */
  setAdmin(adminData) {
    if (!adminData) return;

    try {
      const encoded = encode(adminData);
      if (encoded) {
        localStorage.setItem(ADMIN_KEY, encoded);
      }
    } catch (error) {
      console.error('Erreur sauvegarde admin:', error);
    }
  },

  /**
   * Récupère les données admin
   */
  getAdmin() {
    try {
      const encoded = localStorage.getItem(ADMIN_KEY);
      if (!encoded) return null;

      return decode(encoded);
    } catch (error) {
      console.error('Erreur récupération admin:', error);
      return null;
    }
  },

  /**
   * Supprime les données admin
   */
  removeAdmin() {
    try {
      localStorage.removeItem(ADMIN_KEY);
    } catch (error) {
      console.error('Erreur suppression admin:', error);
    }
  },

  /**
   * Nettoie tout le stockage
   */
  clear() {
    this.removeToken();
    this.removeAdmin();
  },

  /**
   * Sauvegarde une donnée générique
   */
  setItem(key, value) {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      const encoded = encode(value);
      if (encoded) {
        localStorage.setItem(fullKey, encoded);
      }
    } catch (error) {
      console.error(`Erreur sauvegarde ${key}:`, error);
    }
  },

  /**
   * Récupère une donnée générique
   */
  getItem(key) {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      const encoded = localStorage.getItem(fullKey);
      if (!encoded) return null;

      return decode(encoded);
    } catch (error) {
      console.error(`Erreur récupération ${key}:`, error);
      return null;
    }
  },

  /**
   * Supprime une donnée générique
   */
  removeItem(key) {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Erreur suppression ${key}:`, error);
    }
  }
};

/**
 * Protection contre les attaques de timing
 */
export function constantTimeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
