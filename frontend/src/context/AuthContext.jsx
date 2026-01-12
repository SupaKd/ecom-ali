import { createContext, useState, useEffect } from 'react';
import { getAdminData, isAuthenticated as checkAuth, logoutAdmin } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminData = getAdminData();
    const authenticated = checkAuth();
    
    if (authenticated && adminData) {
      setAdmin(adminData);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  function login(adminData) {
    setAdmin(adminData);
    setIsAuthenticated(true);
  }

  function logout() {
    logoutAdmin();
    setAdmin(null);
    setIsAuthenticated(false);
  }

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}