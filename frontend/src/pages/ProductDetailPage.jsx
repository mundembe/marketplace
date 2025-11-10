import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { addToCart } from "../api/cart";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`shop/products/${id}/`);
        setProduct(res.data);
      } catch {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const payload = { product_id: product.id, quantity: 1 };
      const res = await api.post("cart/add/", payload);
      alert("Item added to cart!");
      console.log(res.data);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
      alert("Add to cart failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <img
          src={product.image || "https://via.placeholder.com/500"}
          alt={product.title}
          className="w-full h-96 object-cover rounded-xl shadow"
        />

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-gray-500 mb-2">
            Category: <span className="font-medium">{product.category_name}</span>
          </p>
          <p className="text-xl font-semibold text-blue-600 mb-4">${product.price}</p>
          <p className={`mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button
            className={`w-full py-2 rounded-lg text-white ${product.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>


          {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}

