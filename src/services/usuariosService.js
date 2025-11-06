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

export const getUsuarios = async () => {
  return axios.get(`${API_URL}/usuarios/`, getAuthHeaders());
};

export const createUsuario = async (data) => {
  return axios.post(`${API_URL}/usuarios/`, data, getAuthHeaders());
};

export const updateUsuario = (id, data) => axios.put(`${API_URL}/usuarios/${id}/`, data, getAuthHeaders());

export const deleteUsuario = (id) => axios.delete(`${API_URL}/usuarios/${id}/`, getAuthHeaders());