import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// instancia principal
const api = axios.create({
  baseURL: API_URL,
});

// interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const BASE_URL = "/reportes";

// 🔹 Obtener cualquier tipo de reporte
export const getReport = async (endpoint, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/${endpoint}${query ? `?${query}` : ""}`;
  const response = await api.get(url);
  return response.data;
};

// 🔹 Exportar reporte en formato Excel o CSV
export const exportReport = async (tipo_reporte, parametros, formato = "excel") => {
  const response = await api.post(`${BASE_URL}/exportar/`, {
    tipo_reporte,
    parametros,
    formato,
  });
  return response.data;
};
