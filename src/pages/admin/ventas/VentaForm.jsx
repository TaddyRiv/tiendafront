// src/pages/admin/ventas/VentaForm.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createVenta } from "../../../services/ventasService";
import { crearIntentStripe } from "../../../services/pagosService";
import StripePayDialog from "./StripePayDialog";

export default function VentaForm({ clientes, productos, empleados, fetchVentas, onSubmit }) {
  const [form, setForm] = useState({
    cliente: "",
    empleado: "",
    tipo_pago: "efectivo",
    detalles: [],
  });

  const [usuarioActual, setUsuarioActual] = useState(null);
  const [stripeModal, setStripeModal] = useState({ open: false, clientSecret: null });

  // ✅ Al montar el componente, obtener usuario actual desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuarioActual(user);
      setForm((prev) => ({ ...prev, empleado: user.id }));
    }
  }, []);

  const handleAddProducto = () => {
    setForm({
      ...form,
      detalles: [...form.detalles, { producto_id: "", cantidad: 1, subtotal: 0 }],
    });
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...form.detalles];
    nuevosDetalles[index][field] = value;

    if (field === "producto_id" || field === "cantidad") {
      const producto = productos.find(
        (p) => p.id === parseInt(nuevosDetalles[index].producto_id)
      );
      if (producto) {
        nuevosDetalles[index].subtotal =
          (producto.precio || 0) * (nuevosDetalles[index].cantidad || 0);
      }
    }

    setForm({ ...form, detalles: nuevosDetalles });
  };

  const totalVenta = form.detalles.reduce(
    (acc, item) => acc + (parseFloat(item.subtotal) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.empleado) {
      Swal.fire("Error", "Debe seleccionarse un empleado responsable", "error");
      return;
    }

    const payload = {
      cliente: parseInt(form.cliente),
      empleado: parseInt(form.empleado || usuarioActual?.id),
      tipo_pago: form.tipo_pago,
      monto: parseFloat(totalVenta).toFixed(2),
      detalles: form.detalles.map((d) => ({
        producto_id: parseInt(d.producto_id),
        cantidad: parseInt(d.cantidad),
        subtotal: parseFloat(d.subtotal).toFixed(2),
      })),
    };

    try {
      if (form.tipo_pago === "efectivo") {
        await createVenta(payload);
        Swal.fire("Éxito", "Venta registrada correctamente", "success");
        fetchVentas();
        setForm({
          cliente: "",
          empleado: usuarioActual?.id || "",
          tipo_pago: "efectivo",
          detalles: [],
        });
        return;
      }
      console.log("Payload enviado a Stripe:", {
        cliente: parseInt(form.cliente),
        empleado: parseInt(form.empleado || usuarioActual?.id),
        tipo_pago: form.tipo_pago,
        detalles: form.detalles.map((d) => ({
          producto_id: parseInt(d.producto_id),
          cantidad: parseInt(d.cantidad),
          subtotal: parseFloat(d.subtotal).toFixed(2),
        })),
      });
      const { client_secret } = await crearIntentStripe({

        cliente: parseInt(form.cliente),
        empleado: parseInt(form.empleado || usuarioActual?.id),
        tipo_pago: form.tipo_pago,
        detalles: form.detalles.map((d) => ({
          producto_id: parseInt(d.producto_id),
          cantidad: parseInt(d.cantidad),
          subtotal: parseFloat(d.subtotal).toFixed(2),
        })),
      });


      if (!client_secret) {
        throw new Error("No se recibió client_secret desde el backend.");
      }

      setStripeModal({ open: true, clientSecret: client_secret });
    } catch (err) {
      console.error("Error al registrar venta:", err);
      Swal.fire("Error", err.response?.data?.detail || "No se pudo procesar la venta", "error");
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 mb-6 space-y-3 bg-white rounded shadow">
        <div className="flex flex-wrap items-center gap-4">
          {/* Cliente */}
          <select
            className="p-2 border rounded w-60"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
            required
          >
            <option value="">Seleccionar cliente</option>
            {clientes
              .filter((c) => c.rol?.nombre === "Cliente")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.username || c.nombre}
                </option>
              ))}
          </select>

          {/* Tipo de pago */}
          <select
            className="w-40 p-2 border rounded"
            value={form.tipo_pago}
            onChange={(e) => setForm({ ...form, tipo_pago: e.target.value })}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="credito">Crédito</option>
          </select>

          {/* Solo visible para SuperAdmin/Admin */}
          {usuarioActual?.rol?.nombre !== "Empleado" && (
            <select
              className="p-2 border rounded w-60"
              value={form.empleado}
              onChange={(e) => setForm({ ...form, empleado: e.target.value })}
              required
            >
              <option value="">Empleado responsable</option>
              {empleados?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.username}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleAddProducto}
            className="px-3 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            + Añadir producto
          </button>
        </div>

        {/* Lista de productos */}
        {form.detalles.length > 0 && (
          <div className="mt-4">
            {form.detalles.map((d, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <select
                  className="p-2 border rounded w-60"
                  value={d.producto_id}
                  onChange={(e) => handleDetalleChange(i, "producto_id", e.target.value)}
                  required
                >
                  <option value="">Producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={d.cantidad}
                  onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                  className="w-24 p-2 border rounded"
                />

                <span className="text-gray-700 w-28">
                  Subtotal: {d.subtotal.toFixed(2)} Bs
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold">
            Total: {totalVenta.toFixed(2)} Bs
          </h2>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Registrar Venta
          </button>
        </div>
      </form>

      {stripeModal.open && (
        <StripePayDialog
          clientSecret={stripeModal.clientSecret}
          onSuccess={() => {
            setStripeModal({ open: false, clientSecret: null });
            Swal.fire(
              "Pago exitoso",
              "El pago se realizó correctamente. La venta se confirmará en segundos.",
              "success"
            );
            if (typeof fetchVentas === "function") {
              fetchVentas();
            }
          }}
          onClose={() => setStripeModal({ open: false, clientSecret: null })}
        />
      )}

    </>
  );
}
