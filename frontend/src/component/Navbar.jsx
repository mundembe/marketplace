import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
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
      setSuggestions(res.data.results.slice(0, 5)); // limit 5 suggestions
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
    // small delay so click event on suggestion registers first
    setTimeout(() => setShowDropdown(false), 100);
  };

  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Marketplace
      </Link>

      <div className="w-1/2 relative">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            ref={searchInputRef}
            placeholder="Search for products..."
            value={query}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => query && setShowDropdown(true)}
            className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((product) => (
              <li
                key={product.id}
                className="px-3 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => handleSelect(product.id)} // use onMouseDown instead of onClick
              >
                {product.title}
              </li>
            ))}
          </ul>
        )}

      </div>

      <Link to="/cart" className="text-blue-600 font-medium hover:underline">
        🛒 Cart
      </Link>
    </nav>
  );
}
