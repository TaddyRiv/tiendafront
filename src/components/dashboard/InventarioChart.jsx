// src/components/dashboard/InventarioChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const InventarioChart = ({ data }) => {
  // Calcular estados del inventario
  const calcularEstados = () => {
    if (!data || data.length === 0) return [];

    let normal = 0;
    let bajoStock = 0;
    let critico = 0;

    data.forEach((producto) => {
      const stock = producto.stock || 0;
      if (stock > 10) normal++;
      else if (stock >= 5) bajoStock++;
      else critico++;
    });

    return [
      { name: "Stock Normal", value: normal, color: "#10B981" },
      { name: "Bajo Stock", value: bajoStock, color: "#F59E0B" },
      { name: "Crítico", value: critico, color: "#EF4444" },
    ];
  };

  const chartData = calcularEstados();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        📦 Estado del Inventario
      </h3>
      {total > 0 ? (
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => [
                  `${value} productos (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-20 text-center text-gray-500">
          No hay datos de inventario disponibles
        </p>
      )}
    </div>
  );
};

export default InventarioChart;