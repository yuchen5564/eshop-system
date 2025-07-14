import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, isAdmin } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        // 檢查是否為管理員
        const adminStatus = await isAdmin(user);
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isAdminUser,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};