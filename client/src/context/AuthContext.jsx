import { createContext, useContext, useState, useEffect } from 'react';
import api from 'utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('orion_token');
    const saved = localStorage.getItem('orion_user');
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('orion_token');
        localStorage.removeItem('orion_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('orion_token', token);
    localStorage.setItem('orion_user', JSON.stringify(u));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
    return u;
  };

  const register = async (name, email, password, profile) => {
    const res = await api.post('/auth/register', { name, email, password, profile });
    const { token, user: u } = res.data;
    localStorage.setItem('orion_token', token);
    localStorage.setItem('orion_user', JSON.stringify(u));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('orion_token');
    localStorage.removeItem('orion_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('orion_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
