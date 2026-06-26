import api from "./api";

const offerService = {
  getAllOffers: () => api.get("/api/offers"),
  getCoupons: () => api.get("/api/offers/coupons"),
  getDiscountedItems: () => api.get("/api/offers/discounted-items"),
  getRestaurantDeals: () => api.get("/api/offers/restaurant-deals"),
  validateCoupon: (code) => api.get(`/api/offers/validate/${code}`),
  applyCoupon: (code, orderAmount) =>
    api.post(`/api/offers/apply?code=${code}&orderAmount=${orderAmount}`),

  // Admin
  createCoupon: (data) => api.post("/api/offers/admin/create", data),
  toggleCoupon: (id) => api.put(`/api/offers/admin/${id}/toggle`),
  deleteCoupon: (id) => api.delete(`/api/offers/admin/${id}`),
  getAllCouponsAdmin: () => api.get("/api/offers/admin/all"),
};

export default offerService;