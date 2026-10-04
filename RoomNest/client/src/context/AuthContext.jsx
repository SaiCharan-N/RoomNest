import { createContext, useContext, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('roomnest_user');
    const token = localStorage.getItem('roomnest_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function persistSession(token, userData) {
    localStorage.setItem('roomnest_token', token);
    localStorage.setItem('roomnest_user', JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persistSession(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  async function register(payload) {
    try {
      const { data } = await api.post('/auth/register', payload);
      persistSession(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  function logout() {
    localStorage.removeItem('roomnest_token');
    localStorage.removeItem('roomnest_user');
    setUser(null);
  }

  function updateUser(userData) {
    localStorage.setItem('roomnest_user', JSON.stringify(userData));
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
