import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(producto);
  };
    const BASE_URL = process.env.REACT_APP_API_URL.replace(/\/api$/, "");
  return (
    <div className="p-4 transition duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
      <img
        src={
          producto.foto?.startsWith("http")
            ? producto.foto
            : `${BASE_URL}/${producto.foto}`
        }
        alt={producto.nombre}
        className="object-cover w-full h-48 mb-3 rounded-md"
      />
      <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        {producto.descripcion || "Sin descripción"}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-lg font-bold text-blue-600">
          Bs. {producto.precio}
        </span>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
