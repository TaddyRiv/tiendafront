// src/services/authService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// 🔹 Login de usuario
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login/`, { email, password });

  if (response.data.access) {
    // Guardar tokens
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    // Guardar información completa del usuario
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("user_id", response.data.user.id);
  }

  return response.data;
};

// 🔹 Registro de usuario
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/usuarios/`, userData);
  return response.data;
};

// 🔹 Obtener usuario logueado desde localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 🔹 Cerrar sesión
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("user_id");
};
