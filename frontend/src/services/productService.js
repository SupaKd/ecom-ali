import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export async function fetchProducts() {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des produits');
  }
}

export async function fetchProductById(id) {
  try {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Produit introuvable');
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error('Produit introuvable');
  }
}

export async function fetchProductsByCategory(categoryId) {
  try {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des produits');
  }
}

export async function fetchSimilarProducts(brandId, productId) {
  try {
    const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/similar/${brandId}/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des produits similaires');
  }
}