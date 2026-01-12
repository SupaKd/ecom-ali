import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export async function fetchBrands() {
  try {
    const response = await api.get(API_ENDPOINTS.BRANDS);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des marques');
  }
}