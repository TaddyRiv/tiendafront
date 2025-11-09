import axios from "axios";

// Usa variable del entorno (.env)
const BASE_URL =  process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/productos/`;


const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getProductos = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};


export const createProducto = async (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  const res = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


export const updateProducto = async (id, data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  const res = await axios.put(`${API_URL}${id}/`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 🔹 Eliminar producto
export const deleteProducto = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
