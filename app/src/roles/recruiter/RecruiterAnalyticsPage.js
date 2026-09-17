import React from "react";
import { useTenant } from "../../context/TenantContext";

export function RecruiterAnalyticsPage({ jobs = [] }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 9 OF 10 • DRIVE HIRING ANALYTICS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Corporate Recruitment Funnel Analytics</h1>
        <p className="text-xs text-slate-500">Hiring funnel metrics & applicant conversion for {currentTenant?.name}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Total Drives</div>
            <div className="text-3xl font-extrabold text-slate-800 my-1">{jobs.length}</div>
            <div className="text-[11px] text-emerald-700 font-bold">Campus Hiring</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Total Applicants</div>
            <div className="text-3xl font-extrabold text-emerald-600 my-1">42</div>
            <div className="text-[11px] text-emerald-700 font-bold">Candidates Applied</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Shortlist Rate</div>
            <div className="text-3xl font-extrabold text-blue-600 my-1">68%</div>
            <div className="text-[11px] text-blue-700 font-bold">Vector Cosine ≥ 0.70</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Offers Accept Rate</div>
            <div className="text-3xl font-extrabold text-purple-600 my-1">92%</div>
            <div className="text-[11px] text-purple-700 font-bold">E-Signature Signed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAnalyticsPage;
