import React from 'react';

// Componente ligero para mostrar una lista/tabala de inventario
// data: array de objetos con al menos { id?, nombre|producto__nombre|name, stock }
const InventoryTable = ({ data }) => {
  const rows = (Array.isArray(data) ? data : []).map((item, idx) => {
    const nombre = item.nombre || item.producto__nombre || item.name || (item.producto && (item.producto.nombre || item.producto.name)) || `Producto ${idx + 1}`;
    const stock = Number(item.stock ?? item.cantidad ?? item.quantity ?? item.existencias ?? item.disponible ?? 0);
    let estado = 'Normal';
    let badge = 'bg-green-100 text-green-800';
    if (stock <= 4) { estado = 'Crítico'; badge = 'bg-red-100 text-red-800'; }
    else if (stock <= 10) { estado = 'Bajo'; badge = 'bg-yellow-100 text-yellow-800'; }

    return { key: item.id ?? idx, nombre, stock, estado, badge };
  });

  if (!rows.length) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <h4 className="mb-4 text-lg font-semibold text-gray-800">Productos en inventario</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 font-medium">Producto</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t">
                <td className="px-4 py-3">{r.nombre}</td>
                <td className="px-4 py-3 font-semibold">{r.stock}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${r.badge}`}>
                    {r.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
