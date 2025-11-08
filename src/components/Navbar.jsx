import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart, setIsCartOpen } = useCart(); // 👈 Agregamos setIsCartOpen
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-700">
        TiendaFront 🛒
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="font-medium hover:text-blue-700">
          Inicio
        </Link>
        <Link to="/productos" className="font-medium hover:text-blue-700">
          Productos
        </Link>
        <Link to="/contacto" className="font-medium hover:text-blue-700">
          Contacto
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-2 text-blue-600 transition border border-blue-600 rounded hover:bg-blue-50"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Registrarse
        </Link>

        <button 
          onClick={() => setIsCartOpen(true)} // 👈 AGREGAMOS ESTO
          className="relative px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          🛒 Carrito
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