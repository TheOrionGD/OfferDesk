import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function MentorProfilePage() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  // All initial values from auth context — no hardcoded strings
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    designation: user?.designation || "",
    department: user?.department || "",
    batch: user?.batch || "",
    expertise: user?.expertise || "",
    bio: user?.bio || "",
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={profile[key]}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-xl">
        <span className="neu-chip-active">PAGE 10 OF 11 • MENTOR PROFILE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Mentor Bio &amp; Corporate Profile</h1>
        <p className="text-xs text-slate-500">Mentorship credentials for {currentTenant?.name}</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Mentor profile updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {field("Full Name", "name")}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Email", "email", "email")}
            {field("Phone", "phone", "tel", "+91 98765 43210")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Company / Organisation", "company", "text", "e.g. Google Cloud")}
            {field("Designation / Role", "designation", "text", "e.g. Staff Software Engineer")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Department (Graduated)", "department", "text", "e.g. CSE")}
            {field("Graduation Batch", "batch", "text", "e.g. 2022")}
          </div>

          {field("Areas of Expertise", "expertise", "text", "e.g. System Design, Distributed Systems, DevOps")}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Mentorship Bio</label>
            <textarea
              rows={4}
              placeholder="Describe your experience, what you can mentor on, and how you like to help students..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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

export default MentorProfilePage;
