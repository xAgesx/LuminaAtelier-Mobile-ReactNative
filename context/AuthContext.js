import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const TOKEN_EXPIRY_DAYS = 3;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        const now = new Date().getTime();

        if (parsed.expiry && now > parsed.expiry) {
          await clearAuth();
        } else {
          setToken(parsed.token);
          if (userData) setUser(JSON.parse(userData));
        }
      }
    } catch (e) {
      console.log("AuthContext load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken, newUser) => {
    const expiryDate = new Date().getTime() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await AsyncStorage.setItem('token', JSON.stringify({ token: newToken, expiry: expiryDate }));
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  };

  const clearAuth = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('guestMode');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
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

export default AuthContext;