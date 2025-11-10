import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const PagarCuotaModal = ({ cuota, onClose, onSuccess }) => {
  const [monto, setMonto] = useState(cuota?.monto || 0);
  const [metodo, setMetodo] = useState("efectivo");
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    if (!cuota) return;
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_URL.replace(/\/api$/, "");
      const token = localStorage.getItem("access");

      const response = await axios.post(
        `${baseUrl}/api/creditos/cuotas/${cuota.id}/pagar/`,
        { monto, metodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Pago exitoso",
        text: response.data.detail,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error al pagar cuota:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.detail ||
          "No se pudo registrar el pago. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cuota) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Pagar Cuota #{cuota.numero_cuota}
        </h2>

        <p className="text-sm text-gray-600 mb-2">
          Monto pendiente: <strong>Bs. {cuota.monto}</strong>
        </p>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Monto a pagar:
        </label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Método de pago:
        </label>
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handlePago}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagarCuotaModal;
