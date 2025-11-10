import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, DollarSign, Calendar, User, FileText, ShoppingBag } from "lucide-react";

export default function MisComprasPage() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/mis-compras/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompras(data);
    } catch (error) {
      console.error("Error al cargar las compras:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando tus compras...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <ShoppingBag className="text-purple-600" /> Mis Compras
      </h1>

      {compras.length === 0 ? (
        <p className="text-gray-500 text-center">Aún no has realizado compras.</p>
      ) : (
        <div className="space-y-6">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Encabezado */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Compra #{compra.id} —{" "}
                  <span
                    className={`uppercase ${
                      compra.tipo_pago === "tarjeta"
                        ? "text-blue-600"
                        : compra.tipo_pago === "efectivo"
                        ? "text-green-600"
                        : "text-purple-600"
                    }`}
                  >
                    {compra.tipo_pago}
                  </span>
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    compra.estado === "completado"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {compra.estado}
                </span>
              </div>

              {/* Datos generales */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                <p className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-500" />{" "}
                  <strong>Total:</strong> {compra.monto} Bs
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />{" "}
                  <strong>Fecha:</strong> {compra.fecha}
                </p>
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />{" "}
                  <strong>Atendido por:</strong> {compra.empleado_nombre || "—"}
                </p>
              </div>

              <hr className="my-3" />

              {/* Detalles */}
              <div>
                <p className="text-sm font-medium flex items-center gap-2 mb-2 text-gray-700">
                  <FileText className="w-4 h-4 text-indigo-500" /> Detalles:
                </p>
                {compra.detalles.length === 0 ? (
                  <p className="text-gray-400 text-sm ml-1">Sin productos registrados</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {compra.detalles.map((d, i) => (
                      <li
                        key={i}
                        className="flex justify-between text-gray-700 border-b last:border-none pb-1"
                      >
                        <span>
                          🧾 {d.producto} — x{d.cantidad}
                        </span>
                        <span className="font-medium">{d.subtotal} Bs</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
