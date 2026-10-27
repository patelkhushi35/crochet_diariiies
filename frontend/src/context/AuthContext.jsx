import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.user);
    return res.data;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/password', { currentPassword, newPassword });
    return res.data;
  };

  const addAddress = async (address) => {
    const res = await api.post('/auth/addresses', address);
    setUser(prev => ({ ...prev, addresses: res.data.addresses }));
    return res.data;
  };

  const updateAddress = async (id, address) => {
    const res = await api.put(`/auth/addresses/${id}`, address);
    setUser(prev => ({ ...prev, addresses: res.data.addresses }));
    return res.data;
  };

  const deleteAddress = async (id) => {
    const res = await api.delete(`/auth/addresses/${id}`);
    setUser(prev => ({ ...prev, addresses: res.data.addresses }));
    return res.data;
  };

  const toggleWishlist = async (productId) => {
    const res = await api.post(`/auth/wishlist/${productId}`);
    setUser(prev => ({ ...prev, wishlist: res.data.wishlist }));
    return res.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    toggleWishlist,
    refreshUser: fetchUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}