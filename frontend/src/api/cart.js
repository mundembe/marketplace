import api from "./axios";

// Add an item to the cart (shopper order)
export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post("orders/shopper/", {
    product_id: productId,
    quantity,
  });
  return res.data;
};

// Get the current shopper's cart
export const fetchCart = async () => {
  const res = await api.get("orders/shopper/");
  return res.data;
};

// Remove or update items if needed (future)
export const removeFromCart = async (orderItemId) => {
  const res = await api.delete(`orders/shopper/${orderItemId}/`);
  return res.data;
};
