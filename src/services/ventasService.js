import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL.replace(/\/+$/, "");


const API_URL = `${BASE_URL}/ventas/`;
const DETALLES_URL = `${BASE_URL}/detalles/`;


const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getVentas = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createVenta = async (venta) => {
  const res = await axios.post(API_URL, venta, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};


export const deleteVenta = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}/`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getDetallesVenta = async (idVenta) => {
  const res = await axios.get(`${DETALLES_URL}?nota=${idVenta}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
