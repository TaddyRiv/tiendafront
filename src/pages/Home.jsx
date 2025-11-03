import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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

      <section className="max-w-7xl mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Bienvenido a <span className="text-blue-600">TiendaFront</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Encuentra los mejores productos para ti, con estilo y comodidad.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
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
