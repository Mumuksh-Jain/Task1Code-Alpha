import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user status on application mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await authService.getMe();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        // Silently fail if not logged in (standard behavior)
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data.success) {
        setUser(data.user);
        showToast('success', `Welcome back, ${data.user.name}!`);
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast('error', msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      if (data.success) {
        setUser(data.user);
        showToast('success', `Account created! Welcome, ${data.user.name}`);
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Try again.';
      showToast('error', msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const data = await authService.logout();
      if (data.success) {
        setUser(null);
        showToast('info', 'Logged out successfully.');
      }
    } catch (error) {
      showToast('error', 'Failed to log out correctly.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
