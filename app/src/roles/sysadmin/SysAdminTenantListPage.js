import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaTrash } from "react-icons/fa";

export function SysAdminTenantListPage() {
  const { tenants, switchTenant, deleteTenant, clearAllTenants } = useTenant();

  const handlePurgeAll = async () => {
    if (window.confirm('⚠️ Are you sure you want to remove ALL tenant data from the system?')) {
      await clearAllTenants();
    }
  };

  const handleDeleteTenant = async (tenantId, tenantName) => {
    if (window.confirm(`Delete tenant "${tenantName}" (${tenantId})?`)) {
      await deleteTenant(tenantId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="neu-chip-active">PAGE 3 OF 10 • MULTI-TENANT DIRECTORY</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Global Multi-Tenant Institution Directory</h1>
            <p className="text-xs text-slate-500">Manage onboarded university tenants & switch active tenant scope</p>
          </div>
          <button 
            onClick={handlePurgeAll}
            className="neu-btn-secondary text-xs text-rose-700 hover:bg-rose-50 border-rose-300 font-bold flex items-center gap-2"
          >
            <FaTrash className="text-rose-600" /> Purge All Tenant Data
          </button>
        </div>

        <div className="space-y-3">
          {tenants.length === 0 ? (
            <div className="p-6 neu-card text-center text-xs text-slate-500 font-semibold">
              No tenant data present in system.
            </div>
          ) : (
            tenants.map(t => (
              <div key={t.tenantId} className="p-5 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{t.name} ({t.code})</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Tenant ID: <strong className="font-mono text-emerald-700">{t.tenantId}</strong> • Domain: {t.domain || `${t.code?.toLowerCase()}.ac.in`}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="neu-chip-active text-xs">Active SaaS Tenant</span>
                  <button onClick={() => switchTenant(t.tenantId)} className="neu-btn-primary text-xs font-bold">
                    Switch Scope
                  </button>
                  <button 
                    onClick={() => handleDeleteTenant(t.tenantId, t.name)} 
                    className="neu-btn-secondary text-xs text-rose-700 font-bold"
                    title="Delete Tenant"
                  >
                    <FaTrash className="text-rose-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SysAdminTenantListPage;
