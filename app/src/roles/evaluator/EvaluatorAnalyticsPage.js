import React from "react";
import { useTenant } from "../../context/TenantContext";

export function EvaluatorAnalyticsPage() {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 9 OF 10 • PANEL ANALYTICS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Panelist Evaluation Statistics</h1>
        <p className="text-xs text-slate-500">Scoring consistency & candidate pass rates for {currentTenant?.name}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Evaluations Conducted</div>
            <div className="text-3xl font-extrabold text-slate-800 my-1">18</div>
            <div className="text-[11px] text-emerald-700 font-bold">Total Candidates Assessed</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Average Technical Score</div>
            <div className="text-3xl font-extrabold text-emerald-600 my-1">8.4 / 10</div>
            <div className="text-[11px] text-emerald-700 font-bold">Technical Depth</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Recommendation Rate</div>
            <div className="text-3xl font-extrabold text-blue-600 my-1">72%</div>
            <div className="text-[11px] text-blue-700 font-bold">Recommended Candidates</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluatorAnalyticsPage;
