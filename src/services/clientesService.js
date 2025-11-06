import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/clientes/";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔹 Listar clientes
export const getClientes = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

// 🔹 Crear cliente (opcional)
export const createCliente = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
