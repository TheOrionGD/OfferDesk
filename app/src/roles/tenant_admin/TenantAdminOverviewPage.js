import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaBriefcase, FaGraduationCap, FaCheckDouble, FaExclamationTriangle, FaPlus } from "react-icons/fa";

export function TenantAdminOverviewPage({ drives = [], onOpenDriveModal }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">COLLEGE PLACEMENT OFFICER CONSOLE</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Placement Officer Command Center</h1>
          <p className="text-xs text-slate-600 mt-1">Tenant Admin Console for <strong className="text-emerald-700">{currentTenant?.name || ''}</strong></p>
        </div>

        <button onClick={onOpenDriveModal} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
          <FaPlus /> Authorize Campus Drive
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Drives</span>
            <FaBriefcase className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{drives.length}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Registered Drives</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Enrolled Candidates</span>
            <FaGraduationCap className="text-blue-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">
            {currentTenant?.studentCount ? currentTenant.studentCount.toLocaleString() : '1,420'}
          </div>
          <div className="text-[11px] text-blue-800 font-bold mt-1">Registered Students</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Approved Drives</span>
            <FaCheckDouble className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {drives.filter(d => d.approvedByTenantAdmin).length}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Authorized</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Pending Authorization</span>
            <FaExclamationTriangle className="text-amber-500 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {drives.filter(d => !d.approvedByTenantAdmin).length}
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">Review Required</div>
        </div>
      </div>
    </div>
  );
}

export default TenantAdminOverviewPage;
