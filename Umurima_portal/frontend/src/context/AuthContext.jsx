import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('abahinzi_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('abahinzi_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    localStorage.setItem('abahinzi_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', payload);
    localStorage.setItem('abahinzi_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('abahinzi_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('abahinzi_user', JSON.stringify(updated));
    setUser(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-2xl">🌾 Turimo gutangiza...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};