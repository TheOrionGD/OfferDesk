import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaBriefcase, FaCheckCircle, FaHourglassHalf, FaUserGraduate, FaShieldAlt, FaHeartbeat, FaArrowRight } from "react-icons/fa";

export function StudentOverviewPage({ applications = [], drives = [], onOpenOtpModal }) {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const shortlistedCount = applications.filter(a => a.status === 'shortlisted' || a.status === 'offered').length;
  const inReviewCount = applications.filter(a => a.status === 'applied').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">
            {currentTenant?.code || ''} • STUDENT PLACEMENT SUITE
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Candidate Placement & Skill Command Suite</h1>
          <p className="text-xs text-slate-600 mt-1">
            Student: <strong className="text-emerald-700">{user?.name || "Unspecified Candidate"}</strong> ({user?.department || "N/A"}) {user?.regNo ? `• Reg No: ${user.regNo}` : ''}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onOpenOtpModal}
            className="neu-btn-secondary text-xs flex items-center gap-2"
          >
            <FaShieldAlt className="text-emerald-600" /> Brevo OTP Guard
          </button>
          <Link 
            to="/student/wellness"
            className="neu-btn-primary text-xs flex items-center gap-2"
          >
            <FaHeartbeat /> Placement Wellness
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Submitted Applications</span>
            <FaBriefcase className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-slate-800">{applications.length}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Real-time DB Verified</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Shortlisted Drives</span>
            <FaCheckCircle className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{shortlistedCount}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">Interview Qualified</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">In Review</span>
            <FaHourglassHalf className="text-amber-500 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{inReviewCount}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">Corporate Screening</div>
        </div>

        <div className="p-5 neu-card">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Academic CGPA</span>
            <FaUserGraduate className="text-emerald-600 text-xl" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {user?.gpa ? `${user.gpa} / 10.0` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Quick Access Role Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/student/drives" className="p-5 neu-card neu-card-hover flex items-center justify-between text-slate-800">
          <div>
            <h3 className="font-bold text-sm">Active Recruitment Drives</h3>
            <p className="text-xs text-slate-500 mt-0.5">{drives.length} drives available for {currentTenant?.code || ''}</p>
          </div>
          <FaArrowRight className="text-emerald-600" />
        </Link>
        <Link to="/student/resume-ats" className="p-5 neu-card neu-card-hover flex items-center justify-between text-slate-800">
          <div>
            <h3 className="font-bold text-sm">MongoDB Base64 Resume Storage</h3>
            <p className="text-xs text-slate-500 mt-0.5">Upload PDF & score vector match</p>
          </div>
          <FaArrowRight className="text-emerald-600" />
        </Link>
        <Link to="/student/tracker" className="p-5 neu-card neu-card-hover flex items-center justify-between text-slate-800">
          <div>
            <h3 className="font-bold text-sm">Application Status Pipeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track live hiring stages</p>
          </div>
          <FaArrowRight className="text-emerald-600" />
        </Link>
      </div>
    </div>
  );
}

export default StudentOverviewPage;
