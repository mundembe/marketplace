import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/shopper/");
        setOrders(res.data.results);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (orders.length === 0)
    return (
      <p className="text-center mt-10">
        No orders yet.{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Shop now
        </Link>
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between mb-3">
              <p>
                <span className="font-semibold">Order ID:</span> #{order.id}
              </p>
              <p className="font-semibold text-blue-600">
                {order.status.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={
                      item.product_image ||
                      "https://via.placeholder.com/80?text=No+Image"
                    }
                    alt={item.product_title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium">{item.product_title}</p>
                    <p className="text-gray-500 text-sm">
                      {item.quantity} × ${item.unit_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold">
                Total: ${Number(order.total_amount).toFixed(2)}
              </p>
              <Link
                to={`/orders/${order.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
