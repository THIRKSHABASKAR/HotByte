import api from './api';

const menuService = {

  getAllMenuItems: async () => {
    const response = await api.get('/menu');
    return response.data.data;
  },

  getMenuItemById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data.data;
  },

  searchMenuItems: async (params) => {
    const response = await api.get('/menu/search', {
      params });
    return response.data.data;
  },

  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },
};

export default menuService;