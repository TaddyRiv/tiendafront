import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// ✅ Listar usuarios
export const getUsuarios = async () => {
  return axios.get(`${API_URL}/usuarios/`, getAuthHeaders());
};

// ✅ Crear usuario
export const createUsuario = async (data) => {
  return axios.post(`${API_URL}/usuarios/`, data, getAuthHeaders());
};

// ✅ Actualizar usuario
export const updateUsuario = async (id, data) => {
  return axios.put(`${API_URL}/usuarios/${id}/`, data, getAuthHeaders());
};

// ✅ Eliminar usuario
export const deleteUsuario = async (id) => {
  return axios.delete(`${API_URL}/usuarios/${id}/`, getAuthHeaders());
};
