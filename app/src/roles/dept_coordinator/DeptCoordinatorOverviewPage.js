import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaGraduationCap, FaCheckCircle, FaExclamationTriangle, FaUserCheck } from "react-icons/fa";

export function DeptCoordinatorOverviewPage({ students = [] }) {
  const { currentTenant } = useTenant();

  const clearedCount = students.filter(s => s.verifiedByDept).length;
  const pendingCount = students.filter(s => !s.verifiedByDept).length;
  const signoffPercent = students.length > 0 ? Math.round((clearedCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">DEPARTMENT COORDINATOR & HOD PORTAL</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Academic Validation & HOD Command Suite</h1>
          <p className="text-xs text-slate-600 mt-1">Department student roster & backlog sign-off console for <strong className="text-emerald-700">{currentTenant?.name || ''}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Dept Candidates</span>
            <FaGraduationCap className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{students.length}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Enrolled Students</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">HOD Cleared</span>
            <FaCheckCircle className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{clearedCount}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Academic Sign-off</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Pending Backlog Review</span>
            <FaExclamationTriangle className="text-amber-500 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">Audit Required</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Clearance Rate</span>
            <FaUserCheck className="text-blue-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">{signoffPercent}%</div>
          <div className="text-[11px] text-blue-800 font-bold mt-1">Department Total</div>
        </div>
      </div>
    </div>
  );
}

export default DeptCoordinatorOverviewPage;
