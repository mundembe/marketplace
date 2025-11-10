import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("orders/shopper/");
        console.log("Orders fetched:", res.data.results);
        setOrders(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>
          No orders yet. <Link to="/" className="text-blue-600 hover:underline">Shop now</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            order && order.id ? (
              <Link
                key={order.id}
                to={`/orders/${order.id}`} // make sure OrderDetailPage route exists
                className="block border p-4 rounded-lg hover:bg-gray-100"
              >
                <p>
                  <span className="font-semibold">Order ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {order.status}
                </p>
                <p>
                  <span className="font-semibold">Total:</span> ${Number(order.total_amount || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Items:</span> {order.items?.length || 0}
                </p>
              </Link>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}
