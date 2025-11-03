import React, { useEffect, useState } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../../services/productoService";
import { getCategorias } from "../../services/categoriaService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    categoria_id: "",
    foto: null,
  });
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // 🧩 Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre: form.nombre,
        precio: form.precio,
        descripcion: form.descripcion,
        stock: form.stock,
        categoria_id: form.categoria_id,
      };
      if (form.foto) data.foto = form.foto;

      if (editId) {
        await updateProducto(editId, data);
      } else {
        await createProducto(data);
      }

      setForm({
        nombre: "",
        precio: "",
        descripcion: "",
        stock: "",
        categoria_id: "",
        foto: null,
      });
      setPreview(null);
      setEditId(null);
      fetchProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  // ✏️ Editar producto
  const handleEdit = (p) => {
    setForm({
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.descripcion,
      stock: p.stock,
      categoria_id: p.categoria?.id || "",
      foto: null,
    });
    setPreview(p.foto || null);
    setEditId(p.id);
  };

  // 🗑️ Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await deleteProducto(id);
        fetchProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    }
  };

  // 📸 Manejo de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, foto: file });
    setPreview(URL.createObjectURL(file));
  };

  // 🔢 Paginación
  const totalItems = productos.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentItems = productos.slice(indexOfFirst, indexOfLast);

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de productos</h1>

      {/* 🧱 Formulario */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-3 p-4 mb-6 bg-white rounded shadow"
      >
        <input
          type="text"
          placeholder="Nombre del producto"
          className="border p-2 rounded flex-1 min-w-[150px]"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          className="p-2 border rounded w-28"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          className="w-24 p-2 border rounded"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <select
          className="w-40 p-2 border rounded"
          value={form.categoria_id}
          onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
          required
        >
          <option value="">Categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.descripcion}
            </option>
          ))}
        </select>

        {/* 📸 Subida de imagen compacta */}
        <div className="flex items-center gap-2 p-2 transition border rounded bg-gray-50 hover:border-blue-400">
          <label className="px-3 py-1 text-sm text-white bg-blue-600 rounded shadow-sm cursor-pointer hover:bg-blue-700">
            Subir foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {preview ? (
            <img
              src={preview}
              alt="Vista previa"
              className="object-cover w-10 h-10 border border-blue-200 rounded shadow-sm"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 text-xs text-gray-400 bg-white border border-gray-300 rounded">
              🖼️
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700"
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* 📋 Tabla de productos */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="text-white bg-blue-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Foto</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((p, index) => (
                <tr key={p.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{indexOfFirst + index + 1}</td>
                  <td className="p-3">
                    {p.foto ? (
                      <img
                        src={p.foto}
                        alt={p.nombre}
                        className="object-cover w-12 h-12 border rounded"
                      />
                    ) : (
                      <span className="italic text-gray-400">Sin foto</span>
                    )}
                  </td>
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3">${p.precio}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.categoria?.descripcion || "-"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 text-white bg-yellow-400 rounded shadow-sm hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded shadow-sm hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 italic text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Paginación */}
      {totalItems > 0 && (
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
              {indexOfFirst + 1}–
              {Math.min(indexOfLast, totalItems)} de {totalItems}
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
