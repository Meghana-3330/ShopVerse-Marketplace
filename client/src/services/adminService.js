import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  toggleUserSuspension: async (id) => {
    const response = await api.patch(`/admin/users/${id}/suspend`);
    return response.data;
  },

  getVendors: async (params = {}) => {
    const response = await api.get('/admin/vendors', { params });
    return response.data;
  },

  updateVendorStatus: async (id, status) => {
    const response = await api.patch(`/admin/vendors/${id}/status`, { status });
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  toggleProductStatus: async (id) => {
    const response = await api.patch(`/admin/products/${id}/status`);
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
  }
};
