import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("cart/");
        setCart(res.data);
      } catch {
        alert("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const payload = { shipping_address: shippingAddress, payment_method: paymentMethod };
      const res = await api.post("cart/checkout/", payload);
      alert("Order placed successfully!");
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      console.error("Checkout failed:", err.response?.data || err.message);
      alert("Checkout failed. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading checkout...</p>;
  if (!cart || !cart.items.length)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Summary */}
        <div className="md:col-span-2 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Your Items</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.product_image ||
                      item.product?.primary_image ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.product?.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product?.title}</p>
                    <p className="text-gray-600 text-sm">
                      ${item.product?.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">${item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6 text-lg font-bold">
            <p>Total:</p>
            <p>${cart.total_amount}</p>
          </div>
        </div>

        {/* Checkout Form */}
        <form
          onSubmit={handleCheckout}
          className="bg-white rounded-lg shadow p-4 space-y-4"
        >
          <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Shipping Address</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter your address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
