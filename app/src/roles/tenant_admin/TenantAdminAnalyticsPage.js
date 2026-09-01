import React from "react";
import { useTenant } from "../../context/TenantContext";

export function TenantAdminAnalyticsPage() {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 6 OF 10 • BRANCH HIRING ANALYTICS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Branch-Wise Placement & Package Analytics</h1>
        <p className="text-xs text-slate-500">Placement statistics, average salary bands, and clearance rates for {currentTenant?.name}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Overall Placement %</div>
            <div className="text-3xl font-extrabold text-emerald-600 my-1">94.8%</div>
            <div className="text-[11px] text-emerald-700 font-bold">Class of 2026</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Highest Package</div>
            <div className="text-3xl font-extrabold text-purple-600 my-1">₹44 LPA</div>
            <div className="text-[11px] text-purple-700 font-bold">International Tech Partner</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Average CTC Package</div>
            <div className="text-3xl font-extrabold text-blue-600 my-1">₹9.4 LPA</div>
            <div className="text-[11px] text-blue-700 font-bold">All Engineering Branches</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Total Offers Issued</div>
            <div className="text-3xl font-extrabold text-slate-800 my-1">682</div>
            <div className="text-[11px] text-emerald-700 font-bold">Verified Digital Offers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantAdminAnalyticsPage;
