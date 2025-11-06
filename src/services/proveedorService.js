// src/services/proveedorService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/proveedores/";

// Obtener token guardado (por ejemplo, al iniciar sesión)
const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProveedores = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createProveedor = async (data) => {
  const res = await axios.post(API_URL, data, { headers: getAuthHeader() });
  return res.data;
};

export const updateProveedor = async (id, data) => {
  const res = await axios.put(`${API_URL}${id}/`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteProveedor = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
