import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getHighlights: async () => {
    const response = await api.get('/products/collections/highlights');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  }
};
