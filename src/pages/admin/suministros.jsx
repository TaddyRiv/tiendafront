import React, { useEffect, useState } from "react";
import {
  getSuministros,
  createSuministro,
  updateSuministro,
  deleteSuministro,
} from "../../services/proveedorProductoService";
import { getProveedores } from "../../services/proveedorService";
import { getProductos } from "../../services/productoService";

export default function Suministros() {
  const [suministros, setSuministros] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    proveedor_id: "",
    producto_id: "",
    descripcion: "",
  });
  const [editId, setEditId] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sum, prov, prod] = await Promise.all([
        getSuministros(),
        getProveedores(),
        getProductos(),
      ]);
      setSuministros(sum);
      setProveedores(prov);
      setProductos(prod);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      proveedor_id: form.proveedor_id,
      producto_id: form.producto_id,
      descripcion: form.descripcion,
    };
    try {
      if (editId) {
        await updateSuministro(editId, payload);
      } else {
        await createSuministro(payload);
      }
      setForm({ proveedor_id: "", producto_id: "", descripcion: "" });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error al guardar suministro:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      proveedor_id: item.proveedor?.id || "",
      producto_id: item.producto?.id || "",
      descripcion: item.descripcion || "",
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este suministro?")) {
      try {
        await deleteSuministro(id);
        fetchData();
      } catch (error) {
        console.error("Error al eliminar suministro:", error);
      }
    }
  };

  // Paginación
  const totalItems = suministros.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentItems = suministros.slice(indexOfFirst, indexOfLast);

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de suministros</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-3 p-4 mb-6 bg-white rounded shadow"
      >
        <select
          className="p-2 border rounded w-60"
          value={form.proveedor_id}
          onChange={(e) => setForm({ ...form, proveedor_id: e.target.value })}
          required
        >
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded w-60"
          value={form.producto_id}
          onChange={(e) => setForm({ ...form, producto_id: e.target.value })}
          required
        >
          <option value="">Seleccionar producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Descripción (opcional)"
          className="border p-2 rounded flex-1 min-w-[200px]"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700"
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="text-white bg-blue-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((s, index) => (
                <tr key={s.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{indexOfFirst + index + 1}</td>
                  <td className="p-3">{s.proveedor?.nombre || "-"}</td>
                  <td className="p-3">{s.proveedor?.telefono || "-"}</td>
                  <td className="p-3">{s.producto?.nombre || "-"}</td>
                  <td className="p-3">
                    {s.producto?.categoria?.descripcion || "-"}
                  </td>
                  <td className="p-3">{s.descripcion || "-"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-3 py-1 text-white bg-yellow-400 rounded shadow-sm hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded shadow-sm hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-3 italic text-center text-gray-500"
                >
                  No hay suministros registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {suministros.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filas por página:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              {[10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              {indexOfFirst + 1}–{Math.min(indexOfLast, totalItems)} de{" "}
              {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleChangePage(1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              ⏮
            </button>
            <button
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              ◀
            </button>
            <span className="mx-2 text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              ▶
            </button>
            <button
              onClick={() => handleChangePage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-gray-100"
              }`}
            >
              ⏭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
