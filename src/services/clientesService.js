import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/usuarios/`;

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getClientes = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createCliente = async (data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
