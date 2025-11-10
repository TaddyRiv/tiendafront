import React, { useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [direccion, setDireccion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!cart.length) {
      alert("Tu carrito está vacío.");
      return;
    }

    setLoading(true);

    try {
      // 🧾 Construcción del payload
      const payload = {
        tipo_pago: "contado",
        cliente: user?.id,
        empleado: 1,
        envio: { direccion },
        detalles: cart.map((item) => ({
          producto_id: item.id,
          cantidad: item.quantity,
        })),
      };

      console.log("📤 Enviando a backend:", payload);

      // 🔗 Crear PaymentIntent
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/pagos/stripe/create-intent/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const clientSecret = data?.client_secret;
      console.log("💬 clientSecret recibido:", clientSecret);

      if (!clientSecret) {
        alert("Error: el servidor no devolvió un client_secret válido.");
        setLoading(false);
        return;
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.username || user?.email || "Cliente" },
        },
      });

      if (error) {
        console.error("❌ Error en Stripe:", error);
        alert(`Error: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        alert("✅ Pago completado con éxito!");
        clearCart();
        onSuccess?.();
      }
    } catch (err) {
      console.error("⚠️ Error procesando el pago:", err);
      alert("Error al procesar el pago. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto mt-8"
    >
      <h2 className="text-xl font-bold mb-4">Pago con tarjeta 💳</h2>

      <label className="block mb-2 text-sm font-medium">Dirección de envío :</label>
      <input
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Ej: Calle 7, zona norte..."
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2 text-sm font-medium">Datos de la tarjeta:</label>
      <div className="border p-3 rounded mb-4 bg-gray-50">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Procesando..." : "Pagar ahora"}
      </button>
    </form>
  );
};

const StripeCheckout = ({ onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeCheckout;
