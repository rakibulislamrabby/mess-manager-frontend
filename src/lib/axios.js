
import axios from "axios";

// Main API instance
export const mainApi = axios.create({
  baseURL: import.meta.env.VITE_MAIN_BASE_URL || 'http://mess-management-api.deshicreative.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const localApi = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
