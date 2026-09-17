import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function RecruiterCompanyProfilePage() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const [profile, setProfile] = useState({
    companyName: user?.company || "",
    recruiterName: user?.name || "",
    email: user?.email || "",
    website: user?.website || "",
    industry: user?.industry || "",
    contactPhone: user?.phone || ""
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
        <span className="neu-chip-active">PAGE 10 OF 10 • COMPANY PROFILE & HR SETTINGS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Corporate Partner Profile Settings</h1>
        <p className="text-xs text-slate-500">Corporate identity for placement drives at {currentTenant?.name}</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Corporate profile updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Company Partner Name</label>
            <input 
              type="text" 
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Lead Recruiter Name</label>
              <input 
                type="text" 
                value={profile.recruiterName}
                onChange={(e) => setProfile({ ...profile, recruiterName: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Corporate Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Industry Sector</label>
            <input 
              type="text" 
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Save Profile Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecruiterCompanyProfilePage;
