import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function TenantAdminEligibilityPage() {
  const { currentTenant } = useTenant();

  const [rules, setRules] = useState({
    globalMinGpa: "",
    maxStandingBacklogs: "",
    allowDualOffers: false,
    minAttendancePercent: "",
    eligibleDepartments: ""
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-xl">
        <span className="neu-chip-active">PAGE 3 OF 10 • INSTITUTION ELIGIBILITY ENGINE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Global Student Placement Eligibility Rules</h1>
        <p className="text-xs text-slate-500">Configure global CGPA cutoffs and backlog thresholds for {currentTenant?.name}</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Eligibility rules updated & saved!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Global Minimum CGPA</label>
              <input 
                type="number" step="0.1"
                value={rules.globalMinGpa}
                onChange={(e) => setRules({ ...rules, globalMinGpa: parseFloat(e.target.value) })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Max Standing Backlogs</label>
              <input 
                type="number"
                value={rules.maxStandingBacklogs}
                onChange={(e) => setRules({ ...rules, maxStandingBacklogs: parseInt(e.target.value) })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Min Attendance %</label>
              <input 
                type="number"
                value={rules.minAttendancePercent}
                onChange={(e) => setRules({ ...rules, minAttendancePercent: parseInt(e.target.value) })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-4">
                <input 
                  type="checkbox"
                  checked={rules.allowDualOffers}
                  onChange={(e) => setRules({ ...rules, allowDualOffers: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600"
                />
                Allow Dual Offer Letter Acceptance
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Eligible Departments</label>
            <input 
              type="text" 
              value={rules.eligibleDepartments}
              onChange={(e) => setRules({ ...rules, eligibleDepartments: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Update Eligibility Rules
          </button>
        </form>
      </div>
    </div>
  );
}

export default TenantAdminEligibilityPage;
