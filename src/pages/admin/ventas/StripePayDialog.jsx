import React from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, CardElement, useStripe, useElements} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

function InnerPay({ clientSecret, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("✅ Pago completado correctamente");
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded p-6 w-[420px] shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Pagar con Tarjeta</h3>
        <div className="p-3 border rounded mb-4">
          <CardElement />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={handlePay}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StripePayDialog({ clientSecret, onSuccess, onClose }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <InnerPay clientSecret={clientSecret} onSuccess={onSuccess} onClose={onClose} />
    </Elements>
  );
}
