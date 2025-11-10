import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CuotasCreditoModal({ ventaId, onClose }) {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("efectivo");

  // ✅ Usa tu base URL del .env
  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api$/, "");
  const token = localStorage.getItem("access");

  // 🔹 Cargar cuotas asociadas a la venta
  useEffect(() => {
  const fetchCuotas = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/creditos/cuotas/venta/${ventaId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCuotas(res.data);
    } catch (error) {
      console.error("Error al cargar cuotas:", error);
      Swal.fire("Error", "No se pudieron cargar las cuotas.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (ventaId && token && baseUrl) fetchCuotas();
}, [ventaId, baseUrl, token]); // ✅ añadidos aquí


  // 🔹 Procesar pago
  const handlePagar = async (cuotaId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/creditos/cuotas/${cuotaId}/pagar/`,
        { monto, metodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Pago exitoso", res.data.detail, "success");

      // 🔁 Refrescar cuotas actualizadas
      const refrescar = await axios.get(
        `${baseUrl}/api/creditos/cuotas/venta/${ventaId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCuotas(refrescar.data);
      setCuotaSeleccionada(null);
      setMonto("");
    } catch (error) {
      console.error("Error al pagar:", error);
      Swal.fire(
        "Error",
        error.response?.data?.detail || "No se pudo registrar el pago.",
        "error"
      );
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 text-white">
        Cargando cuotas...
      </div>
    );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg p-6 w-[650px] max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold mb-4">
          Cuotas del crédito - Venta #{ventaId}
        </h2>

        {cuotas.length === 0 ? (
          <p className="text-gray-600 text-center">
            No hay cuotas asociadas a esta venta.
          </p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Monto</th>
                <th className="p-2">Pagado</th>
                <th className="p-2">Fecha límite</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((c, i) => (
                <tr key={c.id} className="border-b text-center">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">Bs. {c.monto}</td>
                  <td className="p-2">
                    {c.pagado ? (
                      <span className="text-green-600 font-semibold">✔️</span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-2">{c.fecha_vencimiento}</td>
                  <td className="p-2">
                    {!c.pagado && (
                      <button
                        onClick={() => setCuotaSeleccionada(c)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                      >
                        Pagar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🔹 Modal interno para confirmar pago */}
        {cuotaSeleccionada && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">
              Pagar cuota #{cuotaSeleccionada.numero_cuota || cuotaSeleccionada.id}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Monto a pagar:</label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder={`Bs. ${cuotaSeleccionada.monto}`}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm">Método:</label>
                <select
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setCuotaSeleccionada(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => handlePagar(cuotaSeleccionada.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
