import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function EvaluatorSettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    expertise: user?.expertise || "",
    availableSlots: user?.availableSlots || ""
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
        <span className="neu-chip-active">PAGE 10 OF 10 • EVALUATOR SETTINGS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Panelist Expertise & Availability Settings</h1>
        <p className="text-xs text-slate-500">Configure technical assessment domain preferences</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Evaluator settings updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Panelist Name</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Official Email</label>
            <input 
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Expertise Domains</label>
            <input 
              type="text" 
              value={profile.expertise}
              onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Save Evaluator Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default EvaluatorSettingsPage;
