// src/services/empleadoService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Este endpoint YA devuelve solo empleados, no es necesario filtrar nada
export const getEmpleados = async () => {
  const res = await axios.get(`${API_URL}/usuarios/empleados/`, {
    headers: getAuthHeader(),
  });

  // Si la API devuelve una lista (array), retornamos directamente
  if (Array.isArray(res.data)) {
    return res.data;
  }

  // Si por alguna razón el backend devuelve un objeto con clave "results"
  if (res.data.results) {
    return res.data.results;
  }

  // fallback
  console.warn("Formato inesperado de respuesta de empleados:", res.data);
  return [];
};
