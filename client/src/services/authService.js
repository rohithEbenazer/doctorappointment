import { request } from './api';

export const authService = {
  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: credentials
    });
    if (res.data && res.data.token) {
      localStorage.setItem('carepulse_token', res.data.token);
      localStorage.setItem('carepulse_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  register: async (userData) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: userData
    });
    if (res.data && res.data.token) {
      localStorage.setItem('carepulse_token', res.data.token);
      localStorage.setItem('carepulse_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  getMe: async () => {
    return await request('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('carepulse_token');
    localStorage.removeItem('carepulse_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('carepulse_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
