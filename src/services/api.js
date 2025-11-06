import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  productos: `${API_URL}/productos/`,
  login: `${API_URL}/login/`,
  register: `${API_URL}/usuarios/`,
};

// 👇 Esto lo agrega
export default api;
