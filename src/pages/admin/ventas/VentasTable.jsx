// src/pages/admin/ventas/VentasTable.jsx
import React from "react";

export default function VentasTable({
  ventas,
  clientes,
  onVerDetalles,
  onDelete,
  onVerCredito, // 👈 nuevo prop
}) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-left">
        <thead className="text-white bg-blue-700">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Tipo de Pago</th>
            <th className="p-3">Monto</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v, index) => (
            <tr key={v.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">
                {clientes.find((c) => c.id === v.cliente)?.nombre ||
                  `ID: ${v.cliente}`}
              </td>
              <td className="p-3 capitalize">{v.tipo_pago}</td>
              <td className="p-3">{v.monto} Bs</td>
              <td className="p-3">{v.fecha}</td>
              <td className="p-3 space-x-2">
                {/* 👁️ Ver detalles */}
                <button
                  onClick={() => onVerDetalles(v.id)}
                  className="px-3 py-1 text-white bg-indigo-500 rounded hover:bg-indigo-600"
                >
                  Ver detalles
                </button>

                {/* 💳 Solo mostrar botón Créditos si la venta fue a crédito */}
                {v.tipo_pago === "credito" && (
                  <button
                    onClick={() => onVerCredito(v.id)}
                    className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Créditos
                  </button>
                )}

                {/* ❌ Eliminar */}
                <button
                  onClick={() => onDelete(v.id)}
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
