// src/components/dashboard/TopProductosChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopProductosChart = ({ data }) => {
  // Formatear datos para la gráfica (máximo 5 productos)
  const chartData = data?.slice(0, 5).map((item) => ({
    nombre: item.producto__nombre?.substring(0, 15) || "Sin nombre",
    unidades: item.unidades_vendidas || 0,
    ingresos: parseFloat(item.ingresos_generados) || 0,
  })) || [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        🏆 Top 5 Productos
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" style={{ fontSize: "12px" }} />
            <YAxis
              type="category"
              dataKey="nombre"
              stroke="#6B7280"
              style={{ fontSize: "11px" }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value, name) => {
                if (name === "unidades") return [value, "Unidades vendidas"];
                if (name === "ingresos") return [`Bs. ${value.toFixed(2)}`, "Ingresos"];
                return [value, name];
              }}
            />
            <Bar dataKey="unidades" fill="#3B82F6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="py-20 text-center text-gray-500">
          No hay datos de productos disponibles
        </p>
      )}
    </div>
  );
};

export default TopProductosChart;