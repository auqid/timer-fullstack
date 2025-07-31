import axios from "axios";

const API_BASE_URL = import.meta.env.PROD
  ? `https://${import.meta.env.VITE_BACKEND_URL}/api`
  : "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
