import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-blue-700">TiendaFront 🛍️</div>

      <ul className="flex space-x-8 text-gray-700 font-medium">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
      </ul>

      <div className="flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 border border-blue-700 text-blue-700 rounded hover:bg-blue-700 hover:text-white transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        >
          Registrarse
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
