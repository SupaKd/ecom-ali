import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { secureStorage } from '../utils/secureStorage';

export async function loginAdmin(email, password) {
  try {
    const response = await api.post(`${API_ENDPOINTS.AUTH}/login`, {
      email,
      password
    });

    const { token, admin } = response.data;

    // Stockage sécurisé
    secureStorage.setToken(token);
    secureStorage.setAdmin(admin);

    return admin;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de connexion');
  }
}

export function logoutAdmin() {
  secureStorage.clear();
}

export function getAdminData() {
  return secureStorage.getAdmin();
}

export function getToken() {
  return secureStorage.getToken();
}

export function isAuthenticated() {
  return !!secureStorage.getToken();
}