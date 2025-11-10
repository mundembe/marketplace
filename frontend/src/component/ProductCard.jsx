import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition p-3">
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="text-gray-500 text-sm mb-1">
          {product.category_name || "Uncategorized"}
        </p>
        <p className="font-bold text-blue-600 mb-2">${product.price}</p>
      </div>
    </Link>
  );
}
