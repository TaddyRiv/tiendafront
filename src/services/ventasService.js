import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/ventas/";
const DETALLES_URL = "http://127.0.0.1:8000/api/detalles/";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔹 Listar ventas
export const getVentas = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

// 🔹 Crear venta nueva
export const createVenta = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// 🔹 Eliminar venta
export const deleteVenta = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// 🔹 Ver detalles de venta
export const getDetallesVenta = async (idVenta) => {
  const res = await axios.get(`${DETALLES_URL}?nota=${idVenta}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
