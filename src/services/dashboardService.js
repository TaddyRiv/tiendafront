// src/services/dashboardService.js

// Usa la misma baseURL que el resto de servicios (definida en .env)
const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
const API_URL = `${BASE_URL}/reportes`;

/**
 * Obtiene los datos completos del dashboard
 * @param {string} periodo - Opciones: 'hoy', 'semana_actual', 'mes_actual', 'mes_anterior', 'trimestre', 'año'
 * @returns {Promise<Object>} Datos del dashboard
 */
export const getDashboardData = async (periodo = "mes_actual") => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/dashboard/?periodo=${periodo}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    throw error;
  }
};

/**
 * Obtiene ventas diarias para el gráfico de línea
 * @param {string} fechaInicio - Formato: YYYY-MM-DD
 * @param {string} fechaFin - Formato: YYYY-MM-DD
 * @returns {Promise<Array>} Array de ventas por día
 */
export const getVentasDiarias = async (fechaInicio, fechaFin) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(
      `${API_URL}/ventas-diarias/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener ventas diarias:", error);
    throw error;
  }
};

/**
 * Obtiene el análisis de categorías
 * @param {string} fechaInicio - Formato: YYYY-MM-DD
 * @param {string} fechaFin - Formato: YYYY-MM-DD
 * @returns {Promise<Array>} Array de categorías con sus métricas
 */
export const getAnalisisCategorias = async (fechaInicio, fechaFin) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(
      `${API_URL}/analisis-categorias/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener análisis de categorías:", error);
    throw error;
  }
};

/**
 * Calcula las fechas del mes actual
 * @returns {Object} {fechaInicio, fechaFin}
 */
export const getFechasMesActual = () => {
  const hoy = new Date();
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  
  const formatearFecha = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return {
    fechaInicio: formatearFecha(primerDia),
    fechaFin: formatearFecha(hoy)
  };
};