import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export async function fetchCategories() {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des catégories');
  }
}

export async function fetchCategoryById(id) {
  try {
    const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Catégorie introuvable');
  }
}

export async function fetchCategoryBySlug(slug) {
  try {
    const response = await api.get(`${API_ENDPOINTS.CATEGORIES}/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error('Catégorie introuvable');
  }
}