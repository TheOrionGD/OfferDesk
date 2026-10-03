import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const TenantContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://offerdesk-js-backend.onrender.com';

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      // Issue 1 Fix: Use the public tenant endpoint — no auth token required.
      // This allows the login-page tenant selector to work before any user logs in.
      // The /api/sysadmin/tenants endpoint requires sysadmin auth and must NOT be
      // called here. The public endpoint returns only safe, minimal fields for ACTIVE tenants.
      const res = await axios.get(`${API_BASE_URL}/api/tenants/public`);
      if (res.data && res.data.tenants && res.data.tenants.length > 0) {
        setTenants(res.data.tenants);
        setCurrentTenant(prev => prev || res.data.tenants[0]);
        setBackendError(null);
      } else {
        setTenants([]);
        setCurrentTenant(null);
      }
    } catch (err) {
      setBackendError('⚠️ Service Disconnected: Unable to communicate with OfferDesk REST Backend on port 5001. Please launch services/js-services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const switchTenant = (tenantId) => {
    const found = tenants.find(t => t.tenantId === tenantId);
    if (found) setCurrentTenant(found);
  };

  const clearAllTenants = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sysadmin/tenants/all`);
      setTenants([]);
      setCurrentTenant(null);
      return { success: true };
    } catch (err) {
      console.error('Failed to clear all tenants:', err);
      setTenants([]);
      setCurrentTenant(null);
      return { success: false, error: err.message };
    }
  };

  const deleteTenant = async (tenantId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sysadmin/tenants/${tenantId}`);
      await fetchTenants();
      return { success: true };
    } catch (err) {
      console.error('Failed to delete tenant:', err);
      return { success: false, error: err.message };
    }
  };

  const createTenant = async (tenantData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/tenants/request`, tenantData);
      await fetchTenants();
      return { success: true, tenant: res.data.tenant, message: res.data.message };
    } catch (err) {
      console.error('Failed to create tenant request:', err);
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  return (
    <TenantContext.Provider value={{ 
      tenants, 
      currentTenant, 
      switchTenant, 
      clearAllTenants,
      deleteTenant,
      createTenant,
      backendError, 
      loading, 
      tenantLoading: loading, 
      refetchTenants: fetchTenants 
    }}>
      {children}
    </TenantContext.Provider>
  );

};

export const useTenant = () => useContext(TenantContext);
