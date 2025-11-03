import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/proveedor-producto/";

const token = localStorage.getItem("accessToken");
const headers = {
  Authorization: `Bearer ${token}`,
};

// Obtener todos
export const getSuministros = async () => {
  const response = await axios.get(API_URL, { headers });
  return response.data;
};

// Crear
export const createSuministro = async (data) => {
  const response = await axios.post(API_URL, data, { headers });
  return response.data;
};

// Actualizar
export const updateSuministro = async (id, data) => {
  const response = await axios.put(`${API_URL}${id}/`, data, { headers });
  return response.data;
};

// Eliminar
export const deleteSuministro = async (id) => {
  const response = await axios.delete(`${API_URL}${id}/`, { headers });
  return response.data;
};
