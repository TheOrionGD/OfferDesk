import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaBriefcase, FaUsers, FaCheckCircle, FaChartBar, FaPlus, FaRobot } from "react-icons/fa";

export function RecruiterOverviewPage({ jobs = [], onNavigateTab }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">CORPORATE RECRUITER PIPELINE</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Recruiter Drive Command Center</h1>
          <p className="text-xs text-slate-600 mt-1">Manage corporate placement drives and candidate AI ATS rankings for {currentTenant?.name || ''}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onNavigateTab('ats')} className="neu-btn-secondary text-xs flex items-center gap-2">
            <FaRobot className="text-emerald-600" /> AI ATS Matcher
          </button>
          <button onClick={() => onNavigateTab('post_drive')} className="neu-btn-primary text-xs flex items-center gap-2">
            <FaPlus /> Post Campus Drive
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Drives</span>
            <FaBriefcase className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{jobs.length}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Published Drives</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Authorized Drives</span>
            <FaCheckCircle className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {jobs.filter(j => j.approvedByTenantAdmin).length}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">TPO Approved</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Target University</span>
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div className="text-sm font-extrabold text-slate-800 truncate mt-2">{currentTenant?.name || ''}</div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">Code: {currentTenant?.code || ''}</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Vector Match Cutoff</span>
            <FaChartBar className="text-purple-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-purple-700">≥ 70%</div>
          <div className="text-[11px] text-purple-800 font-bold mt-1">Cosine Similarity</div>
        </div>
      </div>

      <div className="p-6 neu-card space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Active Campus Recruitment Drives</h3>
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              No campus drives posted yet for {currentTenant?.name}. Click "Post Campus Drive" to create one.
            </div>
          ) : (
            jobs.map(j => (
              <div key={j._id || j.id} className="p-4 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-800">{j.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{j.company} • Location: {j.location || ''} • Salary: {j.salary || ''}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${j.approvedByTenantAdmin ? 'neu-chip-active' : 'neu-chip-inactive'}`}>
                  {j.approvedByTenantAdmin ? 'AUTHORIZED DRIVE' : 'PENDING TPO APPROVAL'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterOverviewPage;
