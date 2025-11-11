import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MarketPlace
      </Link>

      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="border rounded-lg px-3 py-1 w-64 focus:outline-none focus:ring focus:border-blue-400"
        />
        <button type="submit" className="text-gray-600 hover:text-blue-600">
          <Search size={20} />
        </button>
      </form>

      <div className="flex items-center space-x-6">
        <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-blue-600">
          <ShoppingCart size={22} />
          <span className="ml-1">Cart</span>
        </Link>
        <Link to="/orders" className="text-gray-700 hover:text-blue-600">
          Orders
        </Link>
      </div>
    </nav>
  );
}
