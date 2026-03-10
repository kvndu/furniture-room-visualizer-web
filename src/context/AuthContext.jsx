import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AUTH_KEY = "frv_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: "Email and password are required." };
    }

    const mockUser = {
      name: "Interior Designer",
      email
    };

    setUser(mockUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}