import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 bg-gradient-to-r from-blue-100 to-blue-50">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
        Bienvenido a <span className="text-blue-700">TiendaFront</span>
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-xl">
        Encuentra los mejores productos para ti, con estilo y comodidad.
      </p>
      <button className="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition">
        Ver Productos
      </button>

      <div className="mt-10 flex justify-center gap-6 flex-wrap">
        <img
          src="https://images.unsplash.com/photo-1583744946564-b52b6dfdc8a6"
          alt="Producto 1"
          className="w-64 h-80 object-cover rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1602810318383-e386cc2a3a8a"
          alt="Producto 2"
          className="w-64 h-80 object-cover rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
          alt="Producto 3"
          className="w-64 h-80 object-cover rounded-lg shadow-md"
        />
      </div>
    </section>
  );
};

export default Hero;
