import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setCurrentUser({ id: userId });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data?.msg || 'Login failed';
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    try {
      await api.post('/api/auth/signup', { 
        name, 
        email, 
        password, 
        confirmPassword 
      });
    } catch (error) {
      throw error.response?.data?.msg || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};