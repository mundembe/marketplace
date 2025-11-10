import { useState, useEffect } from "react";
import api from "../api/axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/shopper/"); // shopper orders
        setOrders(res.data.results); // <- important: use .results
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders yet.</p>;

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 my-2 rounded-lg">
          <p><strong>Order #{order.id}</strong></p>
          <p>Total: ${order.total_amount}</p>
          <p>Status: {order.status}</p>
          <div className="ml-4 mt-2">
            {order.items.map((item) => (
              <div key={item.id}>
                <p>{item.product_title} x {item.quantity} = ${item.subtotal}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
