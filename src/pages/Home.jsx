import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { getProductos } from "../services/productoService";
import CartSidebar from "../components/CartSidebar";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom"; 

const Home = () => {
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <CartSidebar />

      <section className="px-4 py-16 mx-auto text-center max-w-7xl">
        <h1 className="mb-3 text-4xl font-bold text-gray-800">
          Bienvenido a <span className="text-blue-600">TiendaFront</span>
        </h1>
        <p className="mb-8 text-gray-600">
          Encuentra los mejores productos para ti, con estilo y comodidad.
        </p>

        {/* 🔹 Botón solo visible para admin o superadmin */}
        {(user?.rol?.nombre?.toLowerCase() === "admin" ||
          user?.rol?.nombre?.toLowerCase() === "superadmin") && (
          <div className="flex justify-center mb-8">
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold shadow-md transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-4 4h2v-2h-2v2zm4 0h2v-2h-2v2zm-8 0h2v-2h-2v2zm-4 0h2v-2H7v2zm-4 0h2v-2H3v2zm0-8h2V7H3v2zm4 0h2V7H7v2zm4 0h2V7h-2v2zm4 0h2V7h-2v2zm4 0h2V7h-2v2z"
                />
              </svg>
              Ir al Dashboard
            </Link>
          </div>
        )}
      </section>

      <section className="px-4 pb-16 mx-auto max-w-7xl">
        {loading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No hay productos disponibles.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
