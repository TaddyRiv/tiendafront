import React, { useEffect, useState } from "react";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../../services/proveedorService";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "" });
  const [editId, setEditId] = useState(null);

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  // CRUD functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProveedor(editId, form);
      } else {
        await createProveedor(form);
      }
      setForm({ nombre: "", telefono: "" });
      setEditId(null);
      fetchProveedores();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    }
  };

  const handleEdit = (prov) => {
    setForm({ nombre: prov.nombre, telefono: prov.telefono || "" });
    setEditId(prov.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      try {
        await deleteProveedor(id);
        fetchProveedores();
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
      }
    }
  };

  // 🔹 Cálculo de paginación
  const totalItems = proveedores.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentItems = proveedores.slice(indexOfFirst, indexOfLast);

  // 🔹 Cambiar página
  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // 🔹 Cambiar cantidad por página
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // ============================
  // RENDER
  // ============================

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de Proveedores</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 mb-6 bg-white rounded shadow md:flex-row"
      >
        <input
          type="text"
          placeholder="Nombre del proveedor"
          className="flex-1 p-2 border rounded"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="flex-1 p-2 border rounded"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="text-white bg-blue-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((prov, index) => (
                <tr key={prov.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{indexOfFirst + index + 1}</td>
                  <td className="p-3">{prov.nombre}</td>
                  <td className="p-3">{prov.telefono || "-"}</td>
                  <td className="p-3 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(prov)}
                      className="px-3 py-1 text-white bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(prov.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No hay proveedores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Controles de paginación tipo tabla admin */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
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
              {indexOfFirst + 1}–{Math.min(indexOfLast, totalItems)} of{" "}
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
