import api from './api';

export const vendorService = {
  getDashboard: async () => {
    const response = await api.get('/vendor/dashboard');
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/vendor/products', { params });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/vendor/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/vendor/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/vendor/products/${id}`);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/vendor/orders');
    return response.data;
  },

  updateOrderItemStatus: async (orderId, itemId, status) => {
    const response = await api.patch(`/vendor/orders/${orderId}/items/${itemId}/status`, { status });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/vendor/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/vendor/profile', data);
    return response.data;
  }
};
