import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  UserCircle,
  BarChart,
  Menu,
  LogOut,
  PackagePlus
} from "lucide-react"; 


const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Usuarios", icon: <UserCircle size={20} />, path: "/admin/usuarios" },
    { name: "Clientes", icon: <Users size={20} />, path: "/admin/clientes" },
    { name: "proveedores", icon: <Users size={20} />, path: "/admin/proveedores" },
    { name: "Categorias", icon: <ShoppingBag size={20} />, path: "/admin/categorias" },
    { name: "Productos", icon: <ShoppingBag size={20} />, path: "/admin/productos" },
    { name: "Suministros", icon: <PackagePlus size={20} />, path: "/admin/suministros" },
    { name: "Ventas", icon: <BarChart size={20} />, path: "/admin/ventas" },
    { name: "Reportes", icon: <BarChart size={20} />, path: "/admin/reportes" },
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
        {menuItems.map((item, index) => {
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
