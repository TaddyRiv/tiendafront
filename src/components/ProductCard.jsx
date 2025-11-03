import React from "react";

const ProductCard = ({ producto }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
      <img
        src={producto.imagen || "https://via.placeholder.com/300x200"}
        alt={producto.nombre}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {producto.descripcion || "Sin descripción"}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-blue-600 font-bold text-lg">
          Bs. {producto.precio}
        </span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm">
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
