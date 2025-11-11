import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CartPage() {
  const navigate = useNavigate(); // <-- initialize navigate
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch cart
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("cart/");
      setCart(res.data);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.patch(`cart/update/${itemId}/`, { quantity });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await api.delete(`cart/remove/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!cart) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.items.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Shop now
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <div>
                  <img
                    src={item.product.primary_image || (item.product.images?.[0]?.image) || "https://via.placeholder.com/100"}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />

                  <p>
                    ${item.unit_price} x {item.quantity} = ${item.subtotal}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">
              Total: $
              {cart.total_amount ? Number(cart.total_amount).toFixed(2) : "0.00"}
            </p>
            {/* Redirect to CheckoutPage */}
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
