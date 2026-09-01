import React from "react";
import { useTenant } from "../../context/TenantContext";

export function AuditorNAACCriteriaPage() {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 6 OF 10 • NAAC CRITERION 5 AUDIT</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">NAAC Criterion 5: Student Support & Progression</h1>
        <p className="text-xs text-slate-500">Placement cell career guidance & skill enhancement audit for {currentTenant?.name}</p>

        <div className="p-5 neu-card space-y-2 bg-emerald-50/50">
          <h4 className="text-xs font-bold uppercase text-slate-700">NAAC Grade Assessment</h4>
          <div className="text-2xl font-extrabold text-emerald-800">Grade A++ (Score: 3.82 / 4.00)</div>
          <p className="text-xs text-slate-600">Student Placement Cell & Alumni Support Compliance Verified.</p>
        </div>
      </div>
    </div>
  );
}

export default AuditorNAACCriteriaPage;
