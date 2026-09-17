import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useTenant } from './TenantContext';

// Configure global Axios request interceptor to attach JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('cp_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Configure global window.fetch override to attach JWT token
const originalFetch = window.fetch;
window.fetch = async function (url, options = {}) {
  const token = localStorage.getItem('cp_token');
  if (token) {
    options.headers = options.headers || {};
    if (typeof options.headers.set === 'function') {
      if (!options.headers.get('Authorization')) {
        options.headers.set('Authorization', `Bearer ${token}`);
      }
    } else {
      if (!options.headers['Authorization'] && !options.headers['authorization']) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  }
  return originalFetch(url, options);
};

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const AuthProvider = ({ children }) => {
  const { currentTenant } = useTenant();
  const [authError, setAuthError] = useState(null);
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cp_app_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cp_app_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cp_app_auth_user');
    }
  }, [user]);

  const login = async (email, password, role) => {
    setAuthError(null);
    if (!currentTenant?.tenantId) {
      const err = '⚠️ Tenant Required: Please select an onboarded university tenant before logging in.';
      setAuthError(err);
      throw new Error(err);
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email, password, role, tenantId: currentTenant.tenantId
      });
      if (res.data && res.data.user) {
        if (res.data.token) {
          localStorage.setItem('cp_token', res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (e) {
      const msg = e.response?.data?.error || '⚠️ Service Disconnected: Unable to log in. Backend REST API is offline.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const sendOtp = async (email) => {
    setAuthError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { email });
      return res.data;
    } catch (e) {
      const msg = e.response?.data?.error || '⚠️ Service Disconnected: OTP dispatch failed. Backend REST API is offline.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const verifyOtp = async (email, otpCode, department) => {
    setAuthError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email, otpCode, department });
      if (res.data && res.data.user) {
        if (res.data.token) {
          localStorage.setItem('cp_token', res.data.token);
        }
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (e) {
      const msg = e.response?.data?.error || '⚠️ OTP Verification failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cp_app_auth_user');
    localStorage.removeItem('cp_token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, sendOtp, verifyOtp, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
