import api from './api';

const cartService = {

  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data;
  },

  addToCart: async (menuItemId, quantity = 1) => {
    const response = await api.post('/cart/add', {
      menuItemId,
      quantity,
    });
    return response.data.data;
  },

  updateCartItem: async (cartItemId, quantity) => {
    const response = await api.put('/cart/update', {
      cartItemId,
      quantity,
    });
    return response.data.data;
  },

  removeFromCart: async (cartItemId) => {
    const response = await api.delete(
      `/cart/remove/${cartItemId}`);
    return response.data.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

export default cartService;