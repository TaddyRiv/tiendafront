import React, { useEffect, useState } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../services/categoriaService";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ descripcion: "" });
  const [editId, setEditId] = useState(null);

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategoria(editId, form);
      } else {
        await createCategoria(form);
      }
      setForm({ descripcion: "" });
      setEditId(null);
      fetchCategorias();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  const handleEdit = (cat) => {
    setForm({ descripcion: cat.descripcion });
    setEditId(cat.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría?")) {
      try {
        await deleteCategoria(id);
        fetchCategorias();
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
      }
    }
  };

  // 🔹 Lógica de paginación
  const totalItems = categorias.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentItems = categorias.slice(indexOfFirst, indexOfLast);

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // ============================
  // RENDER
  // ============================

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de Categorías</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 mb-6 bg-white rounded shadow md:flex-row"
      >
        <input
          type="text"
          placeholder="Descripción de la categoría"
          className="flex-1 p-2 border rounded"
          value={form.descripcion}
          onChange={(e) => setForm({ descripcion: e.target.value })}
          required
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
              <th className="p-3">Descripción</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((cat, index) => (
                <tr key={cat.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{indexOfFirst + index + 1}</td>
                  <td className="p-3">{cat.descripcion}</td>
                  <td className="p-3 space-x-2 text-center">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-3 py-1 text-white bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
