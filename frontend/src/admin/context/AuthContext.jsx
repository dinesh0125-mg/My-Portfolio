import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!authService.getToken();
  });

  const [adminUser, setAdminUser] = useState(() => {
    return authService.getCurrentUser() || {
      name: 'Dinesh M',
      email: 'nandhu0259@gmail.com',
      role: 'ADMIN',
    };
  });

  // Verify session on mount if token exists
  useEffect(() => {
    if (authService.getToken()) {
      authService
        .getProfile()
        .then((user) => {
          if (user) {
            setAdminUser(user);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          // Token expired or invalid
          authService.logout();
          setIsAuthenticated(false);
        });
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const result = await authService.login(email, password, rememberMe);
    if (result.success) {
      setIsAuthenticated(true);
      setAdminUser(result.data.admin);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
