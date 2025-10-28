import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode"; // Using named import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || null);

  // decode token whenever accessToken changes (handles reload and login)
  useEffect(() => {
    if (!accessToken) return;
    try {
      const decoded = jwtDecode(accessToken);
      setUser({
        username: decoded.username || decoded.sub,
        user_id: decoded.user_id
      });
    } catch (err) {
      console.error("Token decode error:", err);
      logout();
    }
  }, [accessToken]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.post("accounts/token/", { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      setAccessToken(access); // triggers useEffect to set user
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccessToken(null);
    setUser(null);
  };

  const contextData = {
    user,
    accessToken,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
