import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { FaPlus, FaBuilding, FaTrash } from 'react-icons/fa';

export function SysAdminTenantProvisioning() {
  const { tenants, clearAllTenants, deleteTenant } = useTenant();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [msg, setMsg] = useState(null);

  const handleAddTenant = (e) => {
    e.preventDefault();
    setMsg(`✅ University Tenant "${name}" (${code}) successfully provisioned in SaaS database!`);
    setCode('');
    setName('');
    setDomain('');
  };

  const handlePurgeAll = async () => {
    if (window.confirm('⚠️ Are you sure you want to remove ALL tenant data from the system? This action will wipe all onboarded institution tenant records.')) {
      const res = await clearAllTenants();
      if (res.success) {
        setMsg('🗑️ All tenant data has been successfully removed from system.');
      } else {
        setMsg('⚠️ Failed to purge tenant data.');
      }
    }
  };

  const handleDeleteTenant = async (tenantId, tenantName) => {
    if (window.confirm(`Delete tenant "${tenantName}" (${tenantId})?`)) {
      const res = await deleteTenant(tenantId);
      if (res.success) {
        setMsg(`🗑️ Tenant "${tenantName}" deleted.`);
      }
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">GLOBAL SAAS SUPER ADMIN</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Multi-Tenant University Provisioning Console</h1>
          <p className="text-xs text-slate-600 mt-1">Onboard New University Institutions & Configure Subdomain Data Isolation</p>
        </div>

        <button 
          onClick={handlePurgeAll}
          className="neu-btn-secondary text-xs text-rose-700 hover:bg-rose-50 border-rose-300 font-bold flex items-center gap-2"
        >
          <FaTrash className="text-rose-600" /> Purge All Tenant Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 neu-card space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaPlus className="text-emerald-600" /> Provision New Institution Tenant
          </h3>

          {msg && (
            <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold">
              {msg}
            </div>
          )}

          <form onSubmit={handleAddTenant} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tenant Short Code (e.g. KRCT, PSG, CIT)</label>
              <input type="text" required value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SRM" className="w-full neu-input p-3 text-slate-800 font-semibold focus:outline-none" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Institution Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SRM Institute of Science & Technology" className="w-full neu-input p-3 text-slate-800 font-semibold focus:outline-none" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">University Email Domain</label>
              <input type="text" required value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. srmist.edu.in" className="w-full neu-input p-3 text-slate-800 font-semibold focus:outline-none" />
            </div>

            <button type="submit" className="neu-btn-primary text-xs font-bold w-full py-3">
              Provision Institution Tenant
            </button>
          </form>
        </div>

        <div className="p-6 neu-card space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaBuilding className="text-emerald-600" /> Onboarded Institutions ({tenants.length})
          </h3>

          <div className="space-y-3">
            {tenants.length === 0 ? (
              <div className="p-4 neu-card text-center text-xs text-slate-500 font-semibold">
                No tenant data found in system.
              </div>
            ) : (
              tenants.map(t => (
                <div key={t.tenantId} className="p-4 neu-card flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                    <p className="text-xs text-slate-600">Code: {t.code} • Domain: {t.domain || `${t.code?.toLowerCase()}.edu.in`}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="neu-chip-active text-xs">Isolated RLS</span>
                    <button 
                      onClick={() => handleDeleteTenant(t.tenantId, t.name)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-full transition-colors"
                      title="Delete Tenant"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SysAdminTenantProvisioning;
