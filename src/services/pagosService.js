// src/services/pagosService.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL.replace(/\/+$/, "");

export const crearIntentStripe = async (data) => {
  const token = localStorage.getItem("access_token");
  const res = await axios.post(
    `${BASE_URL}/pagos/stripe/create-intent/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};
