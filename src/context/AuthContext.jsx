"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for saved user on mount
    const savedUser = localStorage.getItem("egyptGuideUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    // Simple mock login
    const newUser = { email, name: email.split("@")[0] };
    setUser(newUser);
    localStorage.setItem("egyptGuideUser", JSON.stringify(newUser));
    return true;
  };

  const register = (name, email, password) => {
    // Simple mock register
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem("egyptGuideUser", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("egyptGuideUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
