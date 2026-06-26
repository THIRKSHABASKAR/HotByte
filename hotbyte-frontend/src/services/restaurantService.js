import api from './api';

const restaurantService = {

  getDashboard: async () => {
    const res = await api.get(
      '/restaurant/dashboard');
    return res.data.data;
  },

  getProfile: async () => {
    const res = await api.get(
      '/restaurant/profile');
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await api.put(
      '/restaurant/profile', data);
    return res.data.data;
  },

  getMyMenu: async () => {
    const res = await api.get('/restaurant/menu');
    return res.data.data;
  },

  addMenuItem: async (data) => {
    const res = await api.post(
      '/restaurant/menu/add', data);
    return res.data.data;
  },

  updateMenuItem: async (itemId, data) => {
    const res = await api.put(
      `/restaurant/menu/${itemId}`, data);
    return res.data.data;
  },

  deleteMenuItem: async (itemId) => {
    const res = await api.delete(
      `/restaurant/menu/${itemId}`);
    return res.data;
  },

  toggleAvailability: async (itemId) => {
    const res = await api.patch(
      `/restaurant/menu/${itemId}/toggle`);
    return res.data;
  },

  getMyCategories: async () => {
    const res = await api.get(
      '/restaurant/categories');
    return res.data.data;
  },

  addCategory: async (data) => {
    const res = await api.post(
      '/restaurant/categories/add', data);
    return res.data.data;
  },

  deleteCategory: async (categoryId) => {
    const res = await api.delete(
      `/restaurant/categories/${categoryId}`);
    return res.data;
  },

  getActiveOrders: async () => {
    const res = await api.get(
      '/restaurant/orders');
    return res.data.data;
  },

  getOrderHistory: async () => {
    const res = await api.get(
      '/restaurant/orders/history');
    return res.data.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await api.put(
      `/restaurant/orders/${orderId}/status`,
      { status });
    return res.data.data;
  },
};

export default restaurantService;