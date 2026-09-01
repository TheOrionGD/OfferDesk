import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function AuditorSettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    agency: user?.agency || "",
    email: user?.email || "",
    digitalKey: user?.digitalKey || ""
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
        <span className="neu-chip-active">PAGE 10 OF 10 • AUDITOR SETTINGS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Auditor Identity & Digital Key Settings</h1>
        <p className="text-xs text-slate-500">Configure accreditation inspector identity & signing keys</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Auditor settings updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Inspector Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Accreditation Agency</label>
            <input 
              type="text" 
              value={profile.agency}
              onChange={(e) => setProfile({ ...profile, agency: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Save Auditor Credentials
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuditorSettingsPage;
