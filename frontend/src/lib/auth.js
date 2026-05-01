'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from './api';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem('mm_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          // Fetch current user details
          fetchUser();
        }
      } catch (e) {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('mm_token', access_token);
      setToken(access_token);
      setUser(userData);
      
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('mm_token', access_token);
      setToken(access_token);
      setUser(userData);
      
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
