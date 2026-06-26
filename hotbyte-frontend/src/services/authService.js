import api from './api';

const authService = {

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, userId, name, email, role } =
      response.data.data;
    // Save to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    return response.data;
  },

  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  getRole: () => {
    return localStorage.getItem('role');
  },

  getUserName: () => {
    return localStorage.getItem('name');
  },
};

export default authService;