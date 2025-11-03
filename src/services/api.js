const API_URL = process.env.REACT_APP_API_URL;

export const endpoints = {
  productos: `${API_URL}/productos/`,
  login: `${API_URL}/login/`,
  register: `${API_URL}/usuarios/`,
};
