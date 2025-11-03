import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        TiendaFront 🛒
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-700 font-medium">
          Inicio
        </Link>
        <Link to="/productos" className="hover:text-blue-700 font-medium">
          Productos
        </Link>
        <Link to="/contacto" className="hover:text-blue-700 font-medium">
          Contacto
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Registrarse
        </Link>

        <button className="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          🛍️ Carrito
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
