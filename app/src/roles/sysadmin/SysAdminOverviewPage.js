import React from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";

export function SysAdminOverviewPage({ onOpenProvisionModal }) {
  const { tenants } = useTenant();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">GLOBAL SAAS SUPER ADMIN</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Multi-Tenant SaaS Super Admin Console</h1>
          <p className="text-xs text-slate-600 mt-1">Super Admin: <strong className="text-emerald-700">{user?.name || "Global Super Admin"}</strong> • System Platform Health Monitor</p>
        </div>

        <button onClick={onOpenProvisionModal} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
          <FaPlus /> Provision New Institution Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Onboarded Tenants</div>
          <div className="text-3xl font-extrabold text-slate-800 my-1">{tenants.length || 3}</div>
          <div className="text-[11px] text-emerald-700 font-bold">Active Institutions</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Total System Users</div>
          <div className="text-3xl font-extrabold text-blue-600 my-1">4,850</div>
          <div className="text-[11px] text-blue-700 font-bold">Cross-Tenant Users</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">REST API Gateway Uptime</div>
          <div className="text-3xl font-extrabold text-emerald-600 my-1">99.98%</div>
          <div className="text-[11px] text-emerald-700 font-bold">Port 5001 Status</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">MongoDB Storage</div>
          <div className="text-3xl font-extrabold text-purple-600 my-1">1.4 GB</div>
          <div className="text-[11px] text-purple-700 font-bold">Base64 PDF Collections</div>
        </div>
      </div>
    </div>
  );
}

export default SysAdminOverviewPage;
