import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../services/usuariosService";
import { getRoles } from "../../services/rolesService";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("todos");
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    telefono: "",
    direccion: "",
    estado: true,
    rol: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  };

  useEffect(() => {
    loadUsuarios();
    loadRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: form.username,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
        estado: form.estado,
        rol_id: form.rol,
        password: form.password || "",
      };

      if (editingId) {
        await updateUsuario(editingId, payload);
      } else {
        await createUsuario(payload);
      }

      setForm({
        username: "",
        email: "",
        telefono: "",
        direccion: "",
        estado: true,
        rol: "",
        password: "",
      });
      setEditingId(null);
      setShowForm(false);
      loadUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id);
    setForm({
      username: usuario.username || "",
      email: usuario.email || "",
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
      estado: usuario.estado,
      rol: usuario.rol?.id || "",
      password: "",
    });
    setShowForm(true);
  };

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


  const filteredUsers =
    filtroRol === "todos"
      ? usuarios
      : usuarios.filter((u) => u.rol?.nombre === filtroRol);


  const columns = [
    {
      name: "Usuario",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono || "—",
    },
    {
      name: "Dirección",
      selector: (row) => row.direccion || "—",
    },
    {
      name: "Rol",
      selector: (row) => row.rol?.nombre || "—",
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-white text-sm ${
            row.estado ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {row.estado ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </button>
      </div>

      {/* Filtro por rol */}
      <div className="flex items-center gap-3 mb-4">
        <label className="font-medium text-gray-700">Filtrar por rol:</label>
        <select
          className="border p-2 rounded"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Empleado">Empleados</option>
          <option value="Cliente">Clientes</option>
          <option value="Admin">Administradores</option>
        </select>
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
            <input
              type="password"
              placeholder="Contraseña"
              className="border p-2 rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
            >
              <option value="">Seleccione un rol...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
            <select
              className="border p-2 rounded"
              value={form.estado ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, estado: e.target.value === "true" })
              }
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        pointerOnHover
        striped
        dense
        noDataComponent="No hay usuarios registrados."
      />
    </div>
  );
};

export default Usuarios;
