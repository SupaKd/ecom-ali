import api from './api';

export async function fetchOrders() {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors du chargement des commandes');
  }
}

export async function fetchOrderById(id) {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Commande introuvable');
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour du statut');
  }
}

export async function updateProductStock(id, stock_quantity) {
  try {
    const response = await api.patch(`/products/${id}/stock`, { stock_quantity });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour du stock');
  }
}

export async function createProduct(formData) {
  try {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de la création du produit');
  }
}

export async function updateProduct(id, formData) {
  try {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la modification du produit');
  }
}

export async function deleteProduct(id) {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    throw new Error('Erreur lors de la suppression du produit');
  }
}

export async function createCategory(formData) {
  try {
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateCategory(id, formData) {
  try {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la catégorie');
  }
}

export async function createBrand(data) {
  try {
    const response = await api.post('/brands', data);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la création de la marque');
  }
}

export async function updateBrand(id, data) {
  try {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la modification de la marque');
  }
}

export async function deleteBrand(id) {
  try {
    await api.delete(`/brands/${id}`);
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la marque');
  }
}