import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function DeptCoordinatorSettingsPage() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const [hodProfile, setHodProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dept: user?.department || "",
    phone: user?.phone || ""
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
        <span className="neu-chip-active">PAGE 10 OF 10 • HOD SETTINGS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Department HOD Profile & Settings</h1>
        <p className="text-xs text-slate-500">Department academic settings for {currentTenant?.name}</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> HOD Profile settings updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">HOD Full Name</label>
            <input 
              type="text" 
              value={hodProfile.name}
              onChange={(e) => setHodProfile({ ...hodProfile, name: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Official Email</label>
              <input 
                type="email" 
                value={hodProfile.email}
                onChange={(e) => setHodProfile({ ...hodProfile, email: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Department</label>
              <input 
                type="text" 
                value={hodProfile.dept}
                onChange={(e) => setHodProfile({ ...hodProfile, dept: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Save HOD Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeptCoordinatorSettingsPage;
