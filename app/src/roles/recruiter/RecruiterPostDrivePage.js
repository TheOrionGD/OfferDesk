import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export function RecruiterPostDrivePage({ onDrivePosted }) {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const [formData, setFormData] = useState({
    title: "",
    company: user?.company || user?.name || "Google Cloud",
    location: "Pan India / Remote",
    salary: "₹18 - ₹24 LPA",
    type: "Full-time",
    description: "Core Software Engineering drive focusing on Distributed Systems & Full Stack Web Apps.",
    skills: "React, Node.js, Python, PostgreSQL, REST APIs",
    minGpa: 7.5,
    eligibleBranches: "CSE, IT, ECE"
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;
    if (!currentTenant?.tenantId) {
      setErrorMsg("⚠️ Tenant Context Required: Please select an onboarded university tenant.");
      return;
    }
    if (!user || !user.id) {
      setErrorMsg("⚠️ Authentication Required: Please log in as an authorized recruiter.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
      const branchesArray = formData.eligibleBranches ? formData.eligibleBranches.split(',').map(b => b.trim()) : [];

      await axios.post(`${API_URL}/api/jobs`, {
        tenantId: currentTenant.tenantId,
        recruiterId: user?.id || user?._id,
        recruiterName: user?.name,
        recruiterRole: user?.role,
        title: formData.title,
        company: formData.company,
        location: formData.location || "",
        salary: formData.salary || "",
        type: formData.type,
        description: formData.description,
        minGpa: parseFloat(formData.minGpa || 0),
        eligibleBranches: branchesArray,
        requiredSkills: skillsArray,
        approvedByTenantAdmin: true
      });

      setSuccessMsg(`🎉 Published Campus Recruitment Drive "${formData.title}" for ${currentTenant.name}!`);
      setFormData({
        title: "", company: user?.company || "Google Cloud", location: "Pan India", salary: "₹18 - ₹24 LPA",
        type: "Full-time", description: "", skills: "React, Node.js", minGpa: 7.5, eligibleBranches: "CSE, IT"
      });

      if (onDrivePosted) onDrivePosted();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      setErrorMsg("⚠️ Failed to publish recruitment drive: Backend REST API on port 5001 is offline.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-2xl">
        <span className="neu-chip-active">PAGE 2 OF 10 • PUBLISH RECRUITMENT DRIVE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Publish New Campus Recruitment Drive</h1>
        <p className="text-xs text-slate-600">Post job vacancies, set minimum CGPA cutoffs, and specify eligible engineering branches for {currentTenant?.name}</p>

        {errorMsg && (
          <div className="p-3 neu-card bg-rose-50 border-rose-300 text-rose-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handlePostJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Company Partner Name</label>
              <input 
                type="text" required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Job Role Title</label>
              <input 
                type="text" required
                placeholder="e.g. Senior Software Development Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Minimum Cutoff CGPA *</label>
              <input 
                type="number" step="0.1" required
                value={formData.minGpa}
                onChange={(e) => setFormData({ ...formData, minGpa: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Package CTC / Salary Band</label>
              <input 
                type="text" 
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Work Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Eligible Department Branches</label>
            <input 
              type="text" 
              placeholder="e.g. CSE, IT, ECE, AI&DS"
              value={formData.eligibleBranches}
              onChange={(e) => setFormData({ ...formData, eligibleBranches: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Required Technical Skills (Comma Separated)</label>
            <input 
              type="text" 
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Drive Description & Hiring Guidelines</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" disabled={submitting} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> {submitting ? 'Publishing Drive to Database...' : 'Publish Campus Recruitment Drive'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecruiterPostDrivePage;
