import { createContext, useEffect, useMemo, useState } from "react";
import { loginUser, logoutUser, restoreUserSession } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoredUser = restoreUserSession();
    setUser(restoredUser);
    setAuthReady(true);
  }, []);

  const login = (email, password) => {
    const result = loginUser(email, password);

    if (result.success) {
      setUser(result.user);
    }

    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, authReady, login, logout, isAuthenticated: Boolean(user) }),
    [user, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
