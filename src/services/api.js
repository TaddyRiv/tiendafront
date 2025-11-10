import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  productos: `${API_URL}/productos/`,
  login: `${API_URL}/login/`,
  register: `${API_URL}/usuarios/`,
};

// --- Helpers / Wrappers para datos del Dashboard ---
// Estos helpers usan la instancia `api` (con interceptor que agrega Authorization)
// y devuelven formas sencillas que el frontend puede consumir.

/**
 * Obtiene el objeto crudo del endpoint /reportes/dashboard/
 * Retorna null si no existe o hubo error.
 */
export async function fetchDashboardRaw() {
  try {
    const resp = await api.get(`/reportes/dashboard/`);
    return resp.data;
  } catch (err) {
    // Intentar devolver null en caso de no existir o 403/401
    return null;
  }
}

/**
 * Obtiene métricas simples para los metric cards: ventas, ingresos, productos, clientes.
 * - ventas: si el dashboard trae `ventas` o `ventas_diarias` (suma), lo calcula
 * - ingresos: busca `ingresos` o `total_ingresos`
 * - productos: consulta listado de productos y devuelve su cantidad (fallback si dashboard lo trae)
 * - clientes: consulta endpoint de usuarios (`/usuarios/`) y devuelve su cantidad
 * Retorna un objeto con shape { ventas, ingresos, productos, clientes }
 */
export async function getDashboardMetrics() {
  const defaults = { ventas: 0, ingresos: 0, productos: 0, clientes: 0 };

  try {
    const raw = await fetchDashboardRaw();

    // Ventas: preferir valores explícitos, si vienen ventas_diarias sumar
    if (raw) {
      if (typeof raw.ventas === "number") {
        defaults.ventas = raw.ventas;
      } else if (Array.isArray(raw.ventas_diarias)) {
        // cada item podría tener { dia, fecha, total, ingresos, valor }
        defaults.ventas = raw.ventas_diarias.reduce((acc, item) => {
          const v =
            typeof item.ingresos === "number"
              ? item.ingresos
              : typeof item.total === "number"
              ? item.total
              : Number(item.valor ?? item.monto ?? item.amount ?? 0);
          return acc + (isNaN(v) ? 0 : v);
        }, 0);
      }

      // ingresos
      if (typeof raw.ingresos === "number") defaults.ingresos = raw.ingresos;
      else if (typeof raw.total_ingresos === "number") defaults.ingresos = raw.total_ingresos;
    }

    // Productos: preferir conteo del endpoint de productos (paginado o lista)
    try {
      const p = await api.get(endpoints.productos);
      if (Array.isArray(p.data)) defaults.productos = p.data.length;
      else if (p.data && typeof p.data.count === "number") defaults.productos = p.data.count;
    } catch (err) {
      // fallbacks: si raw trae productos_count
      if (raw && typeof raw.productos_count === "number") defaults.productos = raw.productos_count;
    }

    // Clientes: intentar conteo en /usuarios/ (endpoints.register)
    try {
      const u = await api.get(endpoints.register);
      if (Array.isArray(u.data)) defaults.clientes = u.data.length;
      else if (u.data && typeof u.data.count === "number") defaults.clientes = u.data.count;
    } catch (err) {
      // dejar 0 si no es accesible
    }

    return defaults;
  } catch (err) {
    return defaults;
  }
}

/**
 * Devuelve las ventas diarias (array) desde /reportes/ventas-diarias/ o desde dashboard.raw
 */
export async function getVentasDiarias() {
  try {
    // preferir endpoint específico
    const resp = await api.get(`/reportes/ventas-diarias/`);
    const raw = resp.data || [];
    // Normalizar cada item a { dia, ingresos }
    return (Array.isArray(raw) ? raw : []).map((item) => {
      const dia = item.dia || item.fecha || item.date || item.day || item.label || null;
      const ingresos =
        typeof item.ingresos === "number"
          ? item.ingresos
          : typeof item.total === "number"
          ? item.total
          : Number(item.valor ?? item.monto ?? item.amount ?? 0);
      return { dia, ingresos };
    });
  } catch (err) {
    // fallback al dashboard raw
    const raw = await fetchDashboardRaw();
    if (raw && Array.isArray(raw.ventas_diarias)) return raw.ventas_diarias;
    return [];
  }
}

/**
 * Intenta obtener top productos (array de { nombre, cantidad }) desde dashboard o analisis
 */
export async function getTopProductos(limit = 5) {
  try {
    const raw = await fetchDashboardRaw();
    if (raw) {
      const candidates = raw.top_productos || raw.top_productos_vendidos || raw.top_products || raw.top5 || [];
      if (Array.isArray(candidates) && candidates.length) {
        // Normalizar a la forma que espera TopProductosChart: { producto__nombre, unidades_vendidas, ingresos_generados }
        const norm = candidates.map((it) => {
          const nombre = it.producto__nombre || (it.producto && (it.producto.nombre || it.producto.name)) || it.nombre || it.name || "Sin nombre";
          const unidades =
            typeof it.unidades_vendidas === "number"
              ? it.unidades_vendidas
              : typeof it.unidades === "number"
              ? it.unidades
              : Number(it.cantidad ?? it.cantidad_vendida ?? it.sold ?? it.total_vendido ?? 0);
          const ingresos =
            typeof it.ingresos_generados === "number"
              ? it.ingresos_generados
              : typeof it.ingresos === "number"
              ? it.ingresos
              : Number(it.total ?? it.valor ?? it.monto ?? 0);
          return { producto__nombre: nombre, unidades_vendidas: unidades, ingresos_generados: ingresos };
        });
        return norm.slice(0, limit);
      }
    }

    // intentar otro endpoint (analisis categorías puede devolver algo útil)
    try {
      const a = await api.get(`/reportes/analisis-categorias/`);
      if (Array.isArray(a.data)) return a.data.slice(0, limit);
    } catch (e) {
      // ignore
    }

    return [];
  } catch (err) {
    return [];
  }
}

/**
 * Obtiene inventario bajo o estado del inventario desde dashboard (campo `bajo_stock`) o endpoint /reportes/inventario/
 */
export async function getInventarioBajo() {
  try {
    const raw = await fetchDashboardRaw();
    if (raw) {
      if (Array.isArray(raw.bajo_stock)) {
        // Normalizar stock
        return raw.bajo_stock.map((it) => ({
          ...it,
          stock: Number(it.stock ?? it.cantidad ?? it.quantity ?? it.existencias ?? it.disponible ?? 0),
        }));
      }
      if (Array.isArray(raw.inventario)) {
        return raw.inventario.map((it) => ({
          ...it,
          stock: Number(it.stock ?? it.cantidad ?? it.quantity ?? it.existencias ?? it.disponible ?? 0),
        }));
      }
    }

    // try specific endpoint
    try {
      const resp = await api.get(`/reportes/inventario/`);
      if (Array.isArray(resp.data)) {
        return resp.data.map((it) => ({
          ...it,
          stock: Number(it.stock ?? it.cantidad ?? it.quantity ?? it.existencias ?? it.disponible ?? 0),
        }));
      }
    } catch (e) {
      // ignore
    }

    return [];
  } catch (err) {
    return [];
  }
}

// export por defecto la instancia axios
export default api;
