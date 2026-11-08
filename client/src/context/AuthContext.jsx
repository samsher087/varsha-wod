import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wod_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('wod_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / refresh profile on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('wod_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('wod_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('wod_token', res.token);
      localStorage.setItem('wod_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    if (res?.token && res?.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('wod_token', res.token);
      localStorage.setItem('wod_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('wod_token');
    localStorage.removeItem('wod_user');
  };

  const updateProfile = async (data) => {
    const res = await apiClient.put('/auth/profile', data);
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem('wod_user', JSON.stringify(res.user));
    }
    return res;
  };

  const refreshUser = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem('wod_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.warn('Error refreshing user', e);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
