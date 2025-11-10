import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { shipping_address: shippingAddress, payment_method: paymentMethod };
      const res = await api.post("cart/checkout/", payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Order placed successfully!");
      console.log(res.data);
      navigate("/orders"); // redirect to orders page
    } catch (err) {
      console.error("Checkout failed:", err.response?.data || err.message);
      alert("Checkout failed: " + JSON.stringify(err.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!cart || cart.items.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Cart Summary */}
      <div className="mb-6 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <p>
                {item.product.title} x {item.quantity}
              </p>
              <p>${Number(item.subtotal).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <hr className="my-2" />
        <p className="text-right font-bold">
          Total: ${cart.total_amount ? Number(cart.total_amount).toFixed(2) : "0.00"}
        </p>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Shipping Address</label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Enter shipping address"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
