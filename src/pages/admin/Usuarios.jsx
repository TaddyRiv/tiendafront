import React, { useEffect, useState } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../services/usuariosService";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    telefono: "",
    direccion: "",
    estado: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar usuarios desde el backend
  const loadUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  // Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUsuario(editingId, form);
      } else {
        await createUsuario(form);
      }
      setForm({
        username: "",
        email: "",
        telefono: "",
        direccion: "",
        estado: true,
      });
      setEditingId(null);
      setShowForm(false);
      loadUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  // Editar usuario
  const handleEdit = (usuario) => {
    setForm(usuario);
    setEditingId(usuario.id);
    setShowForm(true);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await deleteUsuario(id);
        loadUsuarios();
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-md mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="border p-2 rounded"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Correo"
              className="border p-2 rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="border p-2 rounded"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dirección"
              className="border p-2 rounded"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {/* Tabla de usuarios */}
      <table className="w-full bg-white rounded shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2 text-left">Usuario</th>
            <th className="p-2 text-left">Correo</th>
            <th className="p-2 text-left">Teléfono</th>
            <th className="p-2 text-left">Dirección</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.telefono || "—"}</td>
              <td className="p-2">{u.direccion || "—"}</td>
              <td className="p-2">{u.estado ? "Activo" : "Inactivo"}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
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
};

export default Usuarios;
