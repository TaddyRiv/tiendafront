import React from "react";

export default function VentaDetallesModal({ detalles, onClose }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded p-6 w-[600px] max-h-[80vh] overflow-y-auto"
      >
        <h2 className="mb-4 text-xl font-semibold">Detalles de la venta</h2>
        <table className="w-full border">
          <thead className="text-white bg-blue-600">
            <tr>
              <th className="p-2">Producto</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-2">{d.producto.nombre || "Sin nombre"}</td>
                <td className="p-2">{d.cantidad || 0}</td>
                <td className="p-2">{d.subtotal || 0} Bs</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 text-white bg-gray-700 rounded hover:bg-gray-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
