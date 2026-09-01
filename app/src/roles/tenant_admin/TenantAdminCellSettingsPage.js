import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function TenantAdminCellSettingsPage() {
  const { currentTenant } = useTenant();

  const [cellSettings, setCellSettings] = useState({
    tpoName: currentTenant?.placementOfficerName || "",
    tpoEmail: currentTenant?.contactEmail || "",
    tpoPhone: "",
    academicYear: "",
    autoApproveDrives: false
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-xl">
        <span className="neu-chip-active">PAGE 10 OF 10 • PLACEMENT CELL SETTINGS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Placement Cell Administration & Branding</h1>
        <p className="text-xs text-slate-500">Institutional branding & TPO contact settings for {currentTenant?.name}</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Placement Cell settings saved!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Chief Placement Officer Name</label>
            <input 
              type="text" 
              value={cellSettings.tpoName}
              onChange={(e) => setCellSettings({ ...cellSettings, tpoName: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Official TPO Email</label>
              <input 
                type="email" 
                value={cellSettings.tpoEmail}
                onChange={(e) => setCellSettings({ ...cellSettings, tpoEmail: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Contact Hotline</label>
              <input 
                type="text" 
                value={cellSettings.tpoPhone}
                onChange={(e) => setCellSettings({ ...cellSettings, tpoPhone: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Active Academic Batch Year</label>
            <input 
              type="text" 
              value={cellSettings.academicYear}
              onChange={(e) => setCellSettings({ ...cellSettings, academicYear: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Save Placement Cell Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default TenantAdminCellSettingsPage;
