import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

import ProtectedRoute from "./router/ProtectedRoute";
import LayoutWithNavbar from "./layout/LayoutWithNavbar";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ProductsPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <ProductDetailPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CartPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <CheckoutPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <OrdersPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar>
                <OrderDetailPage />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
