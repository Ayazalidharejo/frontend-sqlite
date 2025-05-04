// context/AuthContext.js - Authentication context
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../Apis';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      getCurrentUser()
        .then(data => {
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            isAdmin: data.isAdmin === 1
          });
          setIsAuthenticated(true);
        })
        .catch(err => {
          console.error('Authentication error:', err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  
  // Login function
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser({
      id: userData.userId,
      username: userData.username,
      isAdmin: userData.isAdmin
    });
    setIsAuthenticated(true);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
