import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cliente } from '../types';

interface AuthContextType {
  cliente: Cliente | null;
  login: (cliente: Cliente) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const login = (cliente: Cliente) => {
    setCliente(cliente);
  };

  const logout = () => {
    setCliente(null);
  };

  const isAuthenticated = cliente !== null;

  return (
    <AuthContext.Provider value={{ cliente, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};