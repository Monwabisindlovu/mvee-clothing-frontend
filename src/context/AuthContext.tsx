'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type UserRole = 'admin' | 'user' | null;

interface AuthState {
  role: UserRole;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);

  /* -------------------------------------------------------------------------- */
  /*                            Persisted session                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const storedRole = localStorage.getItem('role') as UserRole;
    if (storedRole) setRole(storedRole);
  }, []);

  function loginAsAdmin() {
    localStorage.setItem('role', 'admin');
    setRole('admin');
  }

  function logout() {
    localStorage.removeItem('role');
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ role, loginAsAdmin, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
