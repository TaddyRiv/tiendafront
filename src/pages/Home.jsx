import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProductos } from "../services/productoService";
import CartSidebar from "../components/CartSidebar"; // 👈 NUEVO
import { getProductos } from "../services/productService";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <CartSidebar /> {/* 👈 AGREGAMOS ESTO */}

      <section className="px-4 py-16 mx-auto text-center max-w-7xl">
        <h1 className="mb-3 text-4xl font-bold text-gray-800">
          Bienvenido a <span className="text-blue-600">TiendaFront</span>
        </h1>
        <p className="mb-8 text-gray-600">
          Encuentra los mejores productos para ti, con estilo y comodidad.
        </p>
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