import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { secureStorage } from '../utils/secureStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requête - Ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = secureStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gestion des erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs réseau
    if (!error.response) {
      console.error('Erreur réseau:', error.message);
      return Promise.reject(new Error('Erreur de connexion au serveur'));
    }

    const { status } = error.response;

    // Token expiré ou invalide
    if (status === 401 || status === 403) {
      // Nettoyer le storage
      secureStorage.clear();

      // Rediriger vers la page de login si on est dans l'admin
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    // Rate limiting
    if (status === 429) {
      console.warn('Trop de requêtes, veuillez patienter');
      return Promise.reject(new Error('Trop de requêtes, veuillez réessayer plus tard'));
    }

    // Erreur serveur
    if (status >= 500) {
      console.error('Erreur serveur:', error.response.data);
      return Promise.reject(new Error('Erreur serveur, veuillez réessayer'));
    }

    return Promise.reject(error);
  }
);

export default api;