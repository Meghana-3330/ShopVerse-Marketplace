import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Verify stored session on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    try {
      const res = await authService.toggleWishlist(productId);
      if (res.success) {
        const updatedUser = { ...user, wishlist: res.wishlist };
        updateUser(updatedUser);
        return true;
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
    return false;
  };

  const isProductInWishlist = (productId) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some((item) => {
      const id = typeof item === 'object' ? item._id : item;
      return id === productId;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role || 'guest',
        isVendor: user?.role === 'vendor',
        isAdmin: user?.role === 'admin',
        isVendorApproved: user?.role === 'vendor' && user?.vendorProfile?.status === 'approved',
        loading,
        login,
        register,
        logout,
        updateUser,
        toggleWishlist,
        isProductInWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
