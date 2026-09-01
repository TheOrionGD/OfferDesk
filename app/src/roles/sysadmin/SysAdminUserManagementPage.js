import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";

import axios from "axios";

export function SysAdminUserManagementPage() {
  const { currentTenant } = useTenant();
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchUsers = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.users) {
        const mapped = res.data.users.map(u => ({
          id: u._id || u.id,
          name: u.name || '',
          email: u.email || '',
          role: u.role || '',
          tenant: u.tenantId || currentTenant.code || ''
        }));
        setGlobalUsers(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch global users:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 4 OF 10 • GLOBAL USER ACCOUNT MANAGER</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Cross-Tenant User Account Management</h1>
        <p className="text-xs text-slate-500">Global user directory across all institution tenants</p>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading global user directory...</div>
        ) : globalUsers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold neu-card">
            No registered users found for institution tenant.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="neu-card bg-slate-100 text-slate-800 uppercase text-xs">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Official Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Tenant Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-semibold">
                {globalUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-800">{u.name}</td>
                    <td className="p-3 font-mono text-emerald-700">{u.email}</td>
                    <td className="p-3">
                      <span className="neu-chip-active text-[10px] py-0.5 px-2">{u.role.toUpperCase()}</span>
                    </td>
                    <td className="p-3">{u.tenant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SysAdminUserManagementPage;
