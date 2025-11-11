import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiLock, FiUser } from "react-icons/fi";
import heroImage from "../assets/Login_hero.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("accounts/token/", { username, password });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("user", JSON.stringify({ username }));

      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3 overflow-hidden">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center bg-gray-50 p-8">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
        >
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
            Marketplace
          </h1>
          <p className="text-gray-500 text-center mb-6">Sign in to your account</p>

          {error && (
            <div className="text-red-500 bg-red-50 border border-red-200 rounded-md p-2 mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
              <span className="px-3 text-gray-500">
                <FiUser />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow px-2 py-2 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
              <span className="px-3 text-gray-500">
                <FiLock />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow px-2 py-2 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Create one
            </span>
          </p>
        </form>
      </div>

      {/* Right Columns - Hero Section */}
      <div className="relative md:col-span-2">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-green
        -900/60"></div>

        <div className="relative z-10 flex items-center justify-center h-full text-center px-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 leading-tight">
              Welcome to Marketplace
            </h2>
            <p className="text-lg text-blue-100 mb-6">
              Discover the latest products, manage your store, and enjoy seamless shopping — all from one powerful platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
