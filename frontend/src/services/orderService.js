import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export async function createOrder(orderData) {
  try {
    const response = await api.post(API_ENDPOINTS.ORDERS, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la création de la commande');
  }
}

export async function fetchOrderByNumber(orderNumber) {
  try {
    const response = await api.get(`${API_ENDPOINTS.ORDERS}/number/${orderNumber}`);
    return response.data;
  } catch (error) {
    throw new Error('Commande introuvable');
  }
}