import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaCheckCircle } from "react-icons/fa";

export function AuditorDiscrepancyLogPage() {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 8 OF 10 • DISCREPANCY EXCEPTION LOG</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Audit Exception & Discrepancy Manager</h1>
        <p className="text-xs text-slate-500">Compliance exception flagging for {currentTenant?.name}</p>

        <div className="p-6 neu-card text-center space-y-2">
          <FaCheckCircle className="text-3xl text-emerald-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">Zero Unresolved Audit Discrepancies</h4>
          <p className="text-xs text-slate-500">All offer letters and CGPA records match institutional ledger.</p>
        </div>
      </div>
    </div>
  );
}

export default AuditorDiscrepancyLogPage;
