export const API_URLS = {
  MAIN: import.meta.env.VITE_MAIN_BASE_URL || 'http://mess-management-api.deshicreative.com/api',
  LOCAL: import.meta.env.VITE_LOCAL_BASE_URL || 'http://localhost:3000/api',
  RULE: 'https://api.example.com/rules',
  FAST: 'https://api.example.com/fast',
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
};

