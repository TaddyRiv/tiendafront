import React from "react";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartSidebar = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 z-50 flex flex-col h-full bg-white shadow-2xl w-96 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white bg-blue-600">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart size={24} />
            Mi Carrito
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 transition-colors rounded-lg hover:bg-blue-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="mt-20 text-center text-gray-500">
              <ShoppingCart size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="mt-2 text-sm">¡Añade productos para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="relative p-4 rounded-lg bg-gray-50">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute p-1 text-red-500 rounded top-2 right-2 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex gap-4">
                    <img
                      src={item.imagen || "https://via.placeholder.com/80"}
                      alt={item.nombre}
                      className="object-cover w-20 h-20 rounded"
                    />
                    <div className="flex-1">
                      <h4 className="mb-1 text-sm font-bold">{item.nombre}</h4>
                      <p className="mb-2 font-bold text-blue-600">
                        Bs. {Number(item.precio).toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 font-bold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-600">Subtotal: </span>
                    <span className="font-bold">
                      Bs. {(item.precio * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botones */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total:</span>
              <span className="text-blue-600">
                Bs. {getTotalPrice().toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                alert("Procediendo al checkout...");
                // Aquí el otro dev conectará con el backend
              }}
              className="w-full py-3 mb-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Proceder al Pago
            </button>

            <button
              onClick={clearCart}
              className="w-full py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CartSidebar;