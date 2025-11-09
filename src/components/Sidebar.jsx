import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  BarChart,
  Menu,
  LogOut,
  PackagePlus,
  Package,
  ChevronDown,
  ChevronRight,
  Truck,
  Tag,
  Boxes,
  FileText,
  LineChart
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [openInventario, setOpenInventario] = useState(false);
  const [openReportes, setOpenReportes] = useState(false);
  const location = useLocation();

  // Mantener submenús abiertos si estás dentro de sus rutas
  useEffect(() => {
    if (
      location.pathname.includes("categorias") ||
      location.pathname.includes("productos") ||
      location.pathname.includes("proveedores") ||
      location.pathname.includes("suministros")
    ) {
      setOpenInventario(true);
    }

    if (
      location.pathname.includes("reportes/standar") ||
      location.pathname.includes("reportes/personalizados") ||
      location.pathname.includes("reportes/prediccion")
    ) {
      setOpenReportes(true);
    }
  }, [location]);

  // Menús principales fuera de los grupos
  const mainItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Usuarios", icon: <UserCircle size={20} />, path: "/admin/usuarios" },
    { name: "Ventas", icon: <BarChart size={20} />, path: "/admin/ventas" },
  ];

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white fixed transition-all duration-300 flex flex-col`}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between p-4 border-b border-blue-600">
        <h1 className={`font-bold text-lg ${!open && "hidden"}`}>AdminPanel</h1>
        <button onClick={() => setOpen(!open)}>
          <Menu size={22} />
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">
        {mainItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                active
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-600 hover:text-white text-blue-100"
              }`}
            >
              {item.icon}
              <span className={`${!open && "hidden"}`}>{item.name}</span>
            </Link>
          );
        })}

        {/* 🔽 Grupo Inventario */}
        <div>
          <button
            onClick={() => setOpenInventario(!openInventario)}
            className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-blue-600 ${
              openInventario ? "bg-blue-600" : "text-blue-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <Package size={20} />
              <span className={`${!open && "hidden"}`}>Inventario</span>
            </span>
            {open && (openInventario ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>

          {openInventario && (
            <div className={`ml-6 mt-1 flex flex-col space-y-1 ${!open && "hidden"}`}>
              <Link to="/admin/categorias" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <Tag size={16} /> Categorías
              </Link>

              <Link to="/admin/productos" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <Boxes size={16} /> Productos
              </Link>

              <Link to="/admin/proveedores" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <Truck size={16} /> Proveedores
              </Link>

              <Link to="/admin/suministros" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <PackagePlus size={16} /> Suministros
              </Link>
            </div>
          )}
        </div>

        {/* 🔽 Grupo Reportes */}
        <div>
          <button
            onClick={() => setOpenReportes(!openReportes)}
            className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-blue-600 ${
              openReportes ? "bg-blue-600" : "text-blue-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <BarChart size={20} />
              <span className={`${!open && "hidden"}`}>Reportes</span>
            </span>
            {open && (openReportes ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>

          {openReportes && (
            <div className={`ml-6 mt-1 flex flex-col space-y-1 ${!open && "hidden"}`}>
              <Link to="/admin/reportes" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <FileText size={16} /> Reportes estándar
              </Link>

              <Link to="/admin/reportes/dinamico" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <FileText size={16} /> Reportes dinámicos
              </Link>

              <Link to="/admin/reportes/prediccion" className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-600">
                <LineChart size={16} /> Predicción
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-600">
        <button className="flex items-center w-full gap-3 p-2 rounded-md hover:bg-blue-600">
          <LogOut size={20} />
          <span className={`${!open && "hidden"}`}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
