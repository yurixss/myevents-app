import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthUser } from '@/types';
import { mockUsers } from '@/utils/mockData';

interface AuthContextType {
  auth: AuthUser;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthUser>({
    user: null,
    isAuthenticated: false
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setAuth({
        user,
        isAuthenticated: true
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      user: null,
      isAuthenticated: false
    });
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    
    setAuth({
      user: newUser,
      isAuthenticated: true
    });
    return true;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}