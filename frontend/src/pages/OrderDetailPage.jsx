import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`orders/shopper/${id}/`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err.response?.data || err.message);
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading order...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-blue-600 hover:underline">← Back to Orders</Link>
      <h1 className="text-2xl font-bold mt-4 mb-2">Order #{order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${Number(order.total_amount).toFixed(2)}</p>
      <p>Payment Method: {order.payment_method}</p>
      <p>Shipping Address: {order.shipping_address}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">Items</h2>
      <div className="space-y-2">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center justify-between border p-2 rounded-lg">
            <img
              src={item.product_image || "https://via.placeholder.com/80"}
              alt={item.product_title}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="ml-4 flex-1">
              <p className="font-semibold">{item.product_title}</p>
              <p>${item.unit_price} x {item.quantity} = ${item.subtotal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
