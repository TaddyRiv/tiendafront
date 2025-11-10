import React, { useEffect, useState } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import VentasChart from "../components/dashboard/VentasChart";
import TopProductosChart from "../components/dashboard/TopProductosChart";
import InventarioChart from "../components/dashboard/InventarioChart";
import InventoryTable from "../components/dashboard/InventoryTable";
import {
  getDashboardData,
  getVentasDiarias,
} from "../services/dashboardService";
import {
  getDashboardMetrics,
  getTopProductos,
  getInventarioBajo,
} from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useDemoInventory, setUseDemoInventory] = useState(false);
  const [demoInventory, setDemoInventory] = useState([]);
  const [useDemoVentas, setUseDemoVentas] = useState(false);
  const [demoVentas, setDemoVentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getDashboardData();
        // obtener métricas simples (ventas, ingresos, productos, clientes)
        const metrics = await getDashboardMetrics();

        // completar fallbacks: ventas_diarias e inventario
        const dashboard = { ...res };

        // inyectar totales calculados (no sobreescribimos si backend ya tiene totales)
        dashboard.totales = dashboard.totales || {};
        dashboard.totales.ventas = dashboard.totales.ventas ?? metrics.ventas;
        dashboard.totales.ingresos =
          dashboard.totales.ingresos ?? metrics.ingresos;
        dashboard.totales.productos =
          dashboard.totales.productos ?? metrics.productos;
        dashboard.totales.clientes =
          dashboard.totales.clientes ?? metrics.clientes;

        // Inventario: backend puede devolver 'inventario' o 'bajo_stock'
        if (!dashboard.inventario) {
          dashboard.inventario = dashboard.bajo_stock || [];
        }

        // Ventas diarias: si no vienen en el dashboard, pedir al endpoint específico usando periodo
        if (!dashboard.ventas_diarias) {
          let fechaInicio = undefined;
          let fechaFin = undefined;
          if (dashboard.periodo) {
            fechaInicio =
              dashboard.periodo.fecha_inicio ||
              dashboard.periodo.fechaInicio ||
              undefined;
            fechaFin =
              dashboard.periodo.fecha_fin ||
              dashboard.periodo.fechaFin ||
              undefined;
          }

          // Si no vienen fechas del dashboard, obtener el mes actual por defecto desde el servicio
          if (fechaInicio && fechaFin) {
            try {
              const ventas = await getVentasDiarias(fechaInicio, fechaFin);
              dashboard.ventas_diarias = ventas || [];
            } catch (e) {
              // Si falla, dejamos vacío
              dashboard.ventas_diarias = [];
            }
          } else {
            dashboard.ventas_diarias = [];
          }
        }

        // Top productos fallback
        if (!dashboard.top_productos || !dashboard.top_productos.length) {
          const top = await getTopProductos(5);
          dashboard.top_productos = top || [];
        }

        // Inventario fallback adicional: si no hay inventario, intentar endpoint específico
        if (!dashboard.inventario || !dashboard.inventario.length) {
          const inv = await getInventarioBajo();
          dashboard.inventario = inv || dashboard.inventario || [];
        }

        // --- Si aún no hay datos, generar demo automático para mostrar gráficos ---
        if (
          (!dashboard.ventas_diarias ||
            dashboard.ventas_diarias.length === 0) &&
          (!dashboard.totales || !dashboard.totales.ventas)
        ) {
          // generar 7 días demo consistentes
          const today = new Date();
          const demoV = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            // valores demo suaves
            const base = 2500 + i * 800;
            return { dia: d.toISOString().slice(0, 10), ingresos: base };
          });
          dashboard.ventas_diarias = demoV;
          setDemoVentas(demoV);
          setUseDemoVentas(true);
          // también inyectar totales derivados
          dashboard.totales = dashboard.totales || {};
          dashboard.totales.ventas =
            dashboard.totales.ventas ??
            demoV.reduce((s, v) => s + Number(v.ingresos || 0), 0);
          dashboard.totales.ingresos =
            dashboard.totales.ingresos ?? dashboard.totales.ventas;
        }

        if (!dashboard.inventario || dashboard.inventario.length === 0) {
          const demoInv = [
            { id: 1, nombre: "Abrigo clásica", stock: 12 },
            { id: 2, nombre: "Gabardina premi", stock: 4 },
            { id: 3, nombre: "Sombrero mezclilla", stock: 3 },
            { id: 4, nombre: "Vestido imperme", stock: 8 },
            { id: 5, nombre: "Sombrero imperme", stock: 2 },
          ];
          dashboard.inventario = demoInv.map((it) => ({
            ...it,
            stock: Number(it.stock),
          }));
          setDemoInventory(dashboard.inventario);
          setUseDemoInventory(true);
        }

        setData(dashboard);
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const safeGet = (obj, path, fallback = "---") => {
    try {
      if (!obj) return fallback;
      const parts = path.split(".");
      let v = obj;
      for (const p of parts) {
        if (v[p] === undefined) return fallback;
        v = v[p];
      }
      return v ?? fallback;
    } catch {
      return fallback;
    }
  };

  const ventasTotales = safeGet(
    data,
    "totales.ventas",
    safeGet(data, "totales.total_ventas", 0)
  );
  const ingresosTotales = safeGet(
    data,
    "totales.ingresos",
    safeGet(data, "totales.total_ingresos", 0)
  );
  const productosTotales = safeGet(
    data,
    "totales.productos",
    safeGet(data, "totales.total_productos", 0)
  );
  const clientesTotales = safeGet(
    data,
    "totales.clientes",
    safeGet(data, "totales.total_clientes", 0)
  );

  const ventasDiarias = safeGet(data, "ventas_diarias", []);
  const topProductos = safeGet(data, "top_productos", []);
  const inventario = safeGet(data, "inventario", []);

  // Calcular valores derivados si el backend no entrega totales
  const ventasFromDiarias = Array.isArray(ventasDiarias)
    ? ventasDiarias.reduce(
        (acc, it) =>
          acc + (Number(it.ingresos ?? it.total ?? it.valor ?? 0) || 0),
        0
      )
    : 0;
  const ingresosFromDiarias = ventasFromDiarias; // si no hay distinción, usamos lo mismo

  const ventasDisplay =
    Number(ventasTotales) > 0 ? Number(ventasTotales) : ventasFromDiarias;
  const ingresosDisplay =
    Number(ingresosTotales) > 0 ? Number(ingresosTotales) : ingresosFromDiarias;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-2xl font-bold text-gray-700">
        Panel de control
      </h1>

      {loading ? (
        <div className="text-gray-600">Cargando dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            <MetricCard
              icon="💸"
              label="Ventas"
              value={ventasDisplay}
              color="green"
            />
            <MetricCard
              icon="🧾"
              label="Ingresos"
              value={ingresosDisplay}
              color="blue"
            />
            <MetricCard
              icon="📦"
              label="Productos"
              value={productosTotales}
              color="yellow"
            />
            <MetricCard
              icon="👥"
              label="Clientes"
              value={clientesTotales}
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VentasChart
                data={
                  (ventasDiarias && ventasDiarias.length) ||
                  (useDemoVentas && demoVentas.length)
                    ? ventasDiarias && ventasDiarias.length
                      ? ventasDiarias
                      : demoVentas
                    : []
                }
              />
              {/* Mostrar botón para usar datos demo si no hay ventas reales */}
              {(!ventasDiarias || ventasDiarias.length === 0) && (
                <div className="mt-2 text-sm text-gray-500">
                  <button
                    className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded"
                    onClick={() => {
                      if (!useDemoVentas) {
                        // generar demoVentas (7 días)
                        const today = new Date();
                        const demo = Array.from({ length: 7 }).map((_, i) => {
                          const d = new Date(today);
                          d.setDate(today.getDate() - (6 - i));
                          return {
                            dia: d.toISOString().slice(0, 10),
                            ingresos: Math.floor(Math.random() * 8000) + 500,
                          };
                        });
                        setDemoVentas(demo);
                        setUseDemoVentas(true);
                      } else {
                        setUseDemoVentas(false);
                        setDemoVentas([]);
                      }
                    }}
                  >
                    {useDemoVentas
                      ? "Ocultar datos de ejemplo"
                      : "Mostrar datos de ejemplo"}
                  </button>
                </div>
              )}
            </div>
            <div>
              <TopProductosChart data={topProductos} />
            </div>
          </div>

          <div className="mt-6">
            {/* Si no hay inventario real, permitir mostrar demo temporal */}
            {(!inventario || inventario.length === 0) && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  No hay datos de inventario disponibles
                </p>
                <div>
                  <button
                    className="px-3 py-1 mr-2 text-sm text-green-700 bg-green-100 rounded"
                    onClick={() => {
                      if (!useDemoInventory) {
                        const demo = [
                          { id: 1, nombre: "Abrigo clásica", stock: 12 },
                          { id: 2, nombre: "Gabardina premi", stock: 4 },
                          { id: 3, nombre: "Sombrero mezclilla", stock: 3 },
                          { id: 4, nombre: "Vestido imperme", stock: 8 },
                          { id: 5, nombre: "Sombrero imperme", stock: 2 },
                        ];
                        setDemoInventory(
                          demo.map((it) => ({ ...it, stock: Number(it.stock) }))
                        );
                        setUseDemoInventory(true);
                      } else {
                        setUseDemoInventory(false);
                        setDemoInventory([]);
                      }
                    }}
                  >
                    {useDemoInventory
                      ? "Ocultar demo"
                      : "Mostrar demo de inventario"}
                  </button>
                </div>
              </div>
            )}

            <InventarioChart
              data={
                inventario && inventario.length
                  ? inventario
                  : useDemoInventory
                  ? demoInventory
                  : []
              }
            />
            {/* Tabla detallada de inventario debajo del chart */}
            <InventoryTable
              data={
                inventario && inventario.length
                  ? inventario
                  : useDemoInventory
                  ? demoInventory
                  : []
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
