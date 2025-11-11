import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`shop/products/${id}/`);
        setProduct(res.data);
        // default to primary image or first gallery image
        setSelectedImage(res.data.primary_image || res.data.images?.[0]?.image);
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
      await api.post("cart/add/", payload);
      setMessage("✅ Item added to cart!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
      alert("Add to cart failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        {/* --- IMAGE SECTION --- */}
        <div>
          <div className="border rounded-xl overflow-hidden shadow">
            <img
              src={selectedImage || "https://via.placeholder.com/500"}
              alt={product.title}
              className="w-full h-96 object-cover transition-all"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 0 && (
            <div className="flex mt-4 space-x-2">
              {[product.primary_image, ...product.images.map(i => i.image)]
                .filter(Boolean)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Gallery"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-all hover:opacity-80 ${
                      selectedImage === img ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                ))}
            </div>
          )}
        </div>

        {/* --- DETAILS SECTION --- */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-gray-500 mb-2">
            Category: <span className="font-medium">{product.category_name}</span>
          </p>
          <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price}</p>
          <p className={`mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button
            className={`w-full py-2 rounded-lg text-white ${
              product.stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
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
