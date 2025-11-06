import React, { useEffect, useState } from "react";
import {
  getVentas,
  createVenta,
  deleteVenta,
  getDetallesVenta,
} from "../../services/ventasService";
import { getClientes } from "../../services/clientesService";
import { getProductos } from "../../services/productoService";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    cliente_id: "",
    tipo_pago: "efectivo",
    detalles: [],
  });

  const [detalleModal, setDetalleModal] = useState(null);
  const [ventaDetalles, setVentaDetalles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 📦 Cargar datos iniciales
  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchProductos();
  }, []);

  const fetchVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // ➕ Agregar producto al detalle
  const handleAddProducto = () => {
    setForm({
      ...form,
      detalles: [...form.detalles, { producto_id: "", cantidad: 1, subtotal: 0 }],
    });
  };

  // 🧮 Calcular subtotal
  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...form.detalles];
    nuevosDetalles[index][field] = value;

    if (field === "producto_id" || field === "cantidad") {
      const producto = productos.find(
        (p) => p.id === parseInt(nuevosDetalles[index].producto_id)
      );
      if (producto) {
        nuevosDetalles[index].subtotal =
          (producto.precio || 0) * (nuevosDetalles[index].cantidad || 0);
      }
    }

    setForm({ ...form, detalles: nuevosDetalles });
  };

  // 💰 Calcular total
  const totalVenta = form.detalles.reduce(
    (acc, item) => acc + (parseFloat(item.subtotal) || 0),
    0
  );

  // 💾 Guardar venta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        cliente: form.cliente_id,
        tipo_pago: form.tipo_pago,
        monto: totalVenta.toFixed(2),
        detalles: form.detalles.map((d) => ({
          producto_id: parseInt(d.producto_id),
          cantidad: parseInt(d.cantidad),
          subtotal: parseFloat(d.subtotal).toFixed(2),
        })),
      };

      await createVenta(payload);
      fetchVentas();
      setForm({ cliente_id: "", tipo_pago: "efectivo", detalles: [] });
    } catch (error) {
      console.error("Error al registrar venta:", error);
    }
  };

  // ❌ Eliminar venta
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta venta?")) {
      try {
        await deleteVenta(id);
        fetchVentas();
      } catch (error) {
        console.error("Error al eliminar venta:", error);
      }
    }
  };

  // 👁️ Ver detalles
  const handleVerDetalles = async (idVenta) => {
    try {
      const data = await getDetallesVenta(idVenta);
      setVentaDetalles(data);
      setDetalleModal(true);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
    }
  };

  // 📄 Paginación
  const totalItems = ventas.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentItems = ventas.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de Ventas</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mb-6 space-y-3 bg-white rounded shadow"
      >
        <div className="flex flex-wrap items-center gap-4">
          <select
            className="p-2 border rounded w-60"
            value={form.cliente_id}
            onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            required
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            className="w-40 p-2 border rounded"
            value={form.tipo_pago}
            onChange={(e) => setForm({ ...form, tipo_pago: e.target.value })}
          >
            <option value="efectivo">Efectivo</option>
            <option value="credito">Crédito</option>
          </select>

          <button
            type="button"
            onClick={handleAddProducto}
            className="px-3 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            + Añadir producto
          </button>
        </div>

        {/* Productos agregados */}
        {form.detalles.length > 0 && (
          <div className="mt-4">
            {form.detalles.map((d, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <select
                  className="p-2 border rounded w-60"
                  value={d.producto_id}
                  onChange={(e) =>
                    handleDetalleChange(i, "producto_id", e.target.value)
                  }
                  required
                >
                  <option value="">Producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={d.cantidad}
                  onChange={(e) =>
                    handleDetalleChange(i, "cantidad", e.target.value)
                  }
                  className="w-24 p-2 border rounded"
                />

                <span className="text-gray-700 w-28">
                  Subtotal: {d.subtotal.toFixed(2)} Bs
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold">
            Total: {totalVenta.toFixed(2)} Bs
          </h2>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Registrar Venta
          </button>
        </div>
      </form>

      {/* Tabla */}
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
            {currentItems.map((v, index) => (
              <tr key={v.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{indexOfFirst + index + 1}</td>
                <td className="p-3">{v.cliente}</td>
                <td className="p-3">{v.tipo_pago}</td>
                <td className="p-3">{v.monto} Bs</td>
                <td className="p-3">{v.fecha}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleVerDetalles(v.id)}
                    className="px-3 py-1 text-white bg-indigo-500 rounded hover:bg-indigo-600"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
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

      {/* Modal de detalles */}
      {detalleModal && (
        <div
          onClick={() => setDetalleModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
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
                {ventaDetalles.map((d) => (
                  <tr key={d.id} className="border-b">
                    <td className="p-2">{d.producto}</td>
                    <td className="p-2">{d.cantidad}</td>
                    <td className="p-2">{d.subtotal} Bs</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setDetalleModal(null)}
              className="px-4 py-2 mt-4 text-white bg-gray-700 rounded hover:bg-gray-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
