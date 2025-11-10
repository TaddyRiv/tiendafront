// src/pages/admin/ventas/VentasPage.jsx
import React, { useEffect, useState } from "react";
import CuotasCreditoModal from "./CuotasCreditoModal"; 
import {
  getVentas,
  createVenta,
  deleteVenta,
  getDetallesVenta,
} from "../../../services/ventasService";
import { getClientes } from "../../../services/clientesService";
import { getProductos } from "../../../services/productoService";
import { getEmpleados } from "../../../services/empleadoService"; 
import VentaForm from "./VentaForm";
import VentasTable from "./VentasTable";
import VentaDetallesModal from "./VentaDetallesModal";
import Swal from "sweetalert2";

export default function VentasPage() {
  const [creditoModal, setCreditoModal] = useState(null)
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]); 
  const [ventaDetalles, setVentaDetalles] = useState([]);
  const [detalleModal, setDetalleModal] = useState(false);


  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchProductos();
    fetchEmpleados();
  }, []);


  const fetchVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
    }
  };

  // 👥 Obtener clientes
  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  // 🏷️ Obtener productos
  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  // 👔 Obtener empleados
  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    }
  };

  // 💾 Crear nueva venta
  const handleCreateVenta = async (payload) => {
    try {
      await createVenta(payload);
      await fetchVentas();
      Swal.fire("Éxito", "Venta registrada correctamente", "success");
    } catch (error) {
      console.error("Error al registrar venta:", error);
      Swal.fire(
        "Error",
        error.response?.data?.detail ||
          error.response?.data?.non_field_errors?.[0] ||
          "No se pudo procesar la venta",
        "error"
      );
    }
  };

  // ❌ Eliminar venta
  const handleDeleteVenta = async (id) => {
    if (window.confirm("¿Eliminar esta venta?")) {
      try {
        await deleteVenta(id);
        fetchVentas();
        Swal.fire("Eliminada", "La venta fue eliminada correctamente", "success");
      } catch (error) {
        console.error("Error al eliminar venta:", error);
        Swal.fire("Error", "No se pudo eliminar la venta", "error");
      }
    }
  };

  // 👁️ Ver detalles
  const handleVerDetalles = async (id) => {
    try {
      const data = await getDetallesVenta(id);
      setVentaDetalles(data);
      setDetalleModal(true);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      Swal.fire("Error", "No se pudieron cargar los detalles", "error");
    }
  };

  // 🧱 Render
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Gestión de Ventas</h1>

      {/* ✅ Formulario de registro de venta */}
      <VentaForm
        clientes={clientes}
        productos={productos}
        empleados={empleados} 
        fetchVentas={fetchVentas}
        onSubmit={handleCreateVenta}
      />

      {/* ✅ Tabla de ventas */}
      <VentasTable
        ventas={ventas}
        clientes={clientes}
        onVerDetalles={handleVerDetalles}
        onDelete={handleDeleteVenta}
        onVerCredito={(id) => setCreditoModal(id)}
      />

      {/* ✅ Modal de detalles */}
      {detalleModal && (
        <VentaDetallesModal
          detalles={ventaDetalles}
          onClose={() => setDetalleModal(false)}
        />
      )}
      {creditoModal && (
        <CuotasCreditoModal
          ventaId={creditoModal}
          onClose={() => setCreditoModal(null)}
        />
      )}
    </div>
  );
}
