// src/services/proveedorProductoService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/proveedor-producto/";
const token = localStorage.getItem("accessToken") || localStorage.getItem("access");

const headers = {
  Authorization: `Bearer ${token}`,
};

// Obtener todos los suministros
export const getSuministros = async () => {
  const res = await axios.get(API_URL, { headers });
  return res.data;
};

// Crear nuevo suministro
export const createSuministro = async (data) => {
  const res = await axios.post(API_URL, data, { headers });
  return res.data;
};

// Actualizar suministro
export const updateSuministro = async (id, data) => {
  const res = await axios.put(`${API_URL}${id}/`, data, { headers });
  return res.data;
};

// Eliminar suministro
export const deleteSuministro = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`, { headers });
  return res.data;
};
