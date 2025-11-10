import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 👈 importa el contexto

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { setIsCartOpen, cart } = useCart(); // 👈 para abrir el carrito y contar items

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Tienda Ropa SI2
      </Link>

      {/* Enlaces de navegación */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-600 font-medium">
          Inicio
        </Link>
        <Link to="/productos" className="hover:text-blue-600 font-medium">
          Productos
        </Link>

        {/* Visible sólo si hay usuario */}
        {user && (
          <Link
            to="/mis-compras"
            className="hover:text-blue-600 font-medium"
          >
            Mis Compras
          </Link>
        )}
      </div>

      {/* Área derecha */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700">
          Hola, {user ? user.username : "invitado"}
        </span>

        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>

            {/* 👇 Botón que usa el contexto del carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              🛒 Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5">
                  {itemCount}
                </span>
              )}
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
