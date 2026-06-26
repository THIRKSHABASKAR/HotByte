import api from './api';

const orderService = {

  placeOrder: async (orderData) => {
    const response = await api.post(
      '/orders/place', orderData);
    return response.data.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(
      `/orders/${orderId}`);
    return response.data.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.put(
      `/orders/${orderId}/cancel`);
    return response.data.data;
  },

  // ── Razorpay ──────────────────────────────────

  // Step 1: Create Razorpay order on backend
  createRazorpayOrder: async (amount) => {
    const response = await api.post(
      '/payment/create-order', { amount });
    return response.data.data;
  },

  // Step 2: Verify payment after Razorpay success
  verifyPayment: async (paymentData) => {
    const response = await api.post(
      '/payment/verify', paymentData);
    return response.data.data;
  },
};

export default orderService;