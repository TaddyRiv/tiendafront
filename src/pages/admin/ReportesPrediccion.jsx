import React, { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCcw, AlertTriangle, CheckCircle, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";

export default function ReportesPrediccion() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReporte = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access"); // si usas JWT
      const res = await axios.get("http://localhost:8000/api/reportes/ml/reporte_compras/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReporte(res.data);
    } catch (err) {
      console.error("Error al obtener reporte:", err);
      Swal.fire("Error", "No se pudo generar el reporte de compras.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReporte();
  }, []);

  const getUrgenciaColor = (nivel) => {
    switch (nivel) {
      case "CRÍTICO":
        return "bg-red-600 text-white";
      case "ALTO":
        return "bg-orange-500 text-white";
      case "MEDIO":
        return "bg-yellow-400 text-black";
      default:
        return "bg-green-500 text-white";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📈 Reporte de Predicción de Compras</h1>
        <button
          onClick={fetchReporte}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          disabled={loading}
        >
          <RefreshCcw size={18} className={`${loading && "animate-spin"}`} />
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {/* 🧾 Estadísticas */}
      {reporte && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-blue-800">Total productos</h2>
              <p className="text-2xl font-bold">{reporte.estadisticas.total_productos}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-green-800">A comprar</h2>
              <p className="text-2xl font-bold">{reporte.estadisticas.comprar}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-red-800">Críticos</h2>
              <p className="text-2xl font-bold">{reporte.estadisticas.criticos}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-yellow-800">Sin datos</h2>
              <p className="text-2xl font-bold">{reporte.estadisticas.sin_datos}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <h2 className="font-semibold text-purple-800">Inversión total estimada</h2>
              <p className="text-2xl font-bold">
                ${reporte.estadisticas.inversion_total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 📦 Tabla de recomendaciones */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Urgencia</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Costo Total</th>
                  <th className="p-3">ROI</th>
                  <th className="p-3">Comprar antes de</th>
                  <th className="p-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reporte.recomendaciones.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-gray-500">
                      No hay productos que requieran compra.
                    </td>
                  </tr>
                ) : (
                  reporte.recomendaciones.map((rec, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{rec.nombre}</td>
                      <td className="p-3">{rec.categoria}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${getUrgenciaColor(
                            rec.urgencia
                          )}`}
                        >
                          {rec.urgencia}
                        </span>
                      </td>
                      <td className="p-3 text-center">{rec.cantidad_recomendada}</td>
                      <td className="p-3">${rec.financiero?.costo_total.toFixed(2)}</td>
                      <td className="p-3">{(rec.financiero?.roi * 100).toFixed(0)}%</td>
                      <td className="p-3">{rec.fechas?.comprar_antes_de}</td>
                      <td className="p-3">
                        {rec.accion === "COMPRAR" ? (
                          <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition">
                            <ShoppingCart size={16} /> Comprar
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500">
                            <CheckCircle size={16} /> Ok
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🔔 Alertas globales */}
          <div className="mt-8">
            {reporte.recomendaciones
              .filter((r) => r.alertas && r.alertas.length > 0)
              .map((r, i) => (
                <div
                  key={i}
                  className="p-4 mb-3 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-red-800 flex items-center gap-2">
                    <AlertTriangle size={18} /> {r.nombre}
                  </h3>
                  <ul className="ml-6 mt-2 text-sm text-red-700 list-disc">
                    {r.alertas.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
