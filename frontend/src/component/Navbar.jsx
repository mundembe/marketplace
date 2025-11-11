import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiSearch } from "react-icons/fi";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setMenuOpen(false);
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await api.get(`shop/products/?search=${value.trim()}`);
      setSuggestions(res.data.results.slice(0, 5));
      setShowDropdown(true);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
    }
  };

  const handleSelect = (productId) => {
    navigate(`/products/${productId}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Marketplace
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-1/2 relative">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search products..."
              value={query}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => query && setShowDropdown(true)}
              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <FiSearch />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 bg-white border border-gray-200 mt-1 w-full rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
                  onMouseDown={() => handleSelect(product.id)}
                >
                  {product.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <FiShoppingCart size={22} />
            <span className="hidden sm:inline ml-1 font-medium">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Search + Links */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={handleChange}
              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
            >
              <FiSearch />
            </button>
          </form>
          <Link
            to="/orders"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-blue-600 font-medium"
          >
            Orders
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-blue-600 font-medium"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
