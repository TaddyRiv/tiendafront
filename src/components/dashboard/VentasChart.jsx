// src/components/dashboard/VentasChart.jsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VentasChart = ({ data }) => {
  // Formatear datos para la gráfica
  const chartData = data?.map((item) => ({
    fecha: new Date(item.dia).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    }),
    ingresos: parseFloat(item.ingresos) || 0,
  })) || [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        📈 Ventas Diarias
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="fecha"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value) => [`Bs. ${value.toFixed(2)}`, "Ingresos"]}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#2563EB"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="py-20 text-center text-gray-500">
          No hay datos de ventas disponibles
        </p>
      )}
    </div>
  );
};

export default VentasChart;