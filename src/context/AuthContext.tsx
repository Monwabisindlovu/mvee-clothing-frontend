'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type AdminUser = {
  email: string;
};

type AuthContextType = {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isAdmin: () => boolean; // <-- added
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_data');

    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const login = (token: string, admin: AdminUser) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_data', JSON.stringify(admin));
    setAdmin(admin);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdmin(null);
    window.location.href = '/admin/login';
  };

  // Helper to check admin status
  const isAdmin = () => !!admin;

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
