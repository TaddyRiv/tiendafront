import React, { createContext, useState, useEffect } from "react";
import { login } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("access") || null);

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    setUser(data.user);
    setToken(data.access);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      // Aquí podrías validar el token si quieres más adelante
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
