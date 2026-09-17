import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import RegisterOtpModal from "../../components/RegisterOtpModal";
import axios from "axios";

import StudentOverviewPage from "./StudentOverviewPage";
import StudentDrivesPage from "./StudentDrivesPage";
import StudentTrackerPage from "./StudentTrackerPage";
import StudentResumeATSPage from "./StudentResumeATSPage";
import StudentWellnessSuitePage from "./StudentWellnessSuitePage";
import StudentYearScreenPage from "./StudentYearScreenPage";
import StudentNotificationsPage from "./StudentNotificationsPage";
import StudentRoleChatPage from "./StudentRoleChatPage";
import StudentProfilePage from "./StudentProfilePage";
import StudentSettingsPage from "./StudentSettingsPage";
import StudentConsentPage from "./StudentConsentPage";

import { 
  FaGraduationCap, FaBriefcase, FaHourglassHalf, FaRobot, 
  FaHeartbeat, FaAward, FaBell, FaComments, FaUserEdit, FaCogs,
  FaExclamationTriangle, FaCheckCircle, FaUniversity, FaFileSignature
} from "react-icons/fa";

export function StudentDashboard() {
  const { user } = useAuth();
  const { currentTenant, backendError: tenantError } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchStudentData = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setErrorMsg(null);
    try {
      const appUrl = user?.id
        ? `${API_URL}/api/applications?tenantId=${currentTenant.tenantId}&studentId=${user.id}`
        : `${API_URL}/api/applications?tenantId=${currentTenant.tenantId}`;
      const [appRes, jobRes] = await Promise.all([
        axios.get(appUrl),
        axios.get(`${API_URL}/api/jobs?tenantId=${currentTenant.tenantId}`)
      ]);
      if (appRes.data && appRes.data.applications) setApplications(appRes.data.applications);
      if (jobRes.data && jobRes.data.jobs) setDrives(jobRes.data.jobs);
    } catch (e) {
      setErrorMsg('⚠️ Service Disconnected: Unable to fetch live campus drives. Backend REST API on port 5001 is offline.');
    }
  }, [currentTenant, user, API_URL]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleApplyDrive = async (jobId, jobTitle) => {
    if (!user || !user.id) {
      setErrorMsg('⚠️ Authentication Required: Please log in or verify email before applying.');
      return;
    }
    if (!currentTenant?.tenantId) {
      setErrorMsg('⚠️ Tenant Context Required: Please select an onboarded university tenant.');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/applications`, {
        tenantId: currentTenant.tenantId,
        jobId,
        studentId: user?.id || user?._id,
        studentName: user?.name,
        studentRole: user?.role,
        status: 'applied'
      });
      setSuccessMsg(`🎉 Applied to ${jobTitle}! Application registered in database.`);
      fetchStudentData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      setErrorMsg('⚠️ Drive Application failed: Backend REST API on port 5001 is offline.');
    }
  };

  const navItems = [
    { key: 'overview',    title: '1. Overview',      icon: <FaGraduationCap /> },
    { key: 'drives',      title: '2. Drives',         icon: <FaBriefcase /> },
    { key: 'tracker',     title: '3. Tracker',         icon: <FaHourglassHalf /> },
    { key: 'resume_ats',  title: '4. Resume & ATS',   icon: <FaRobot /> },
    { key: 'wellness',    title: '5. Wellness',        icon: <FaHeartbeat /> },
    { key: 'year',        title: '6. Year Roadmap',   icon: <FaAward /> },
    { key: 'notif',       title: '7. Notices',         icon: <FaBell /> },
    { key: 'chat',        title: '8. Role Chat',       icon: <FaComments /> },
    { key: 'profile',     title: '9. Profile',         icon: <FaUserEdit /> },
    { key: 'settings',    title: '10. Settings',       icon: <FaCogs /> },
    { key: 'consents',    title: '11. E-Consent',      icon: <FaFileSignature /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Emerald Green) ────────────────────────── */}
      <div className="role-banner role-banner--student">
        <div className="role-banner-left">
          <span className="role-badge role-badge--student">
            <FaGraduationCap /> Student Portal
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Student'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b' }}>
            {drives.length} Drives · {applications.length} Applied
          </span>
        </div>
      </div>

      {/* Alert Banners */}
      {(errorMsg || tenantError) && (
        <div className="p-4 neu-card bg-rose-50 border-rose-300 text-rose-800 font-semibold text-xs flex items-center gap-3">
          <FaExclamationTriangle className="text-rose-500 text-lg shrink-0" />
          <div>{errorMsg || tenantError}</div>
        </div>
      )}
      {successMsg && (
        <div className="p-4 neu-card bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold text-xs flex items-center gap-3">
          <FaCheckCircle className="text-emerald-600 text-lg shrink-0" />
          <div>{successMsg}</div>
        </div>
      )}

      {/* 10 Page Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === item.key ? 'neu-chip-active--student' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Sub-Page View */}
      {activeTab === 'overview' && (
        <StudentOverviewPage 
          applications={applications} 
          drives={drives} 
          onOpenOtpModal={() => setShowOtpModal(true)} 
        />
      )}
      {activeTab === 'drives' && (
        <StudentDrivesPage drives={drives} onApplyDrive={handleApplyDrive} />
      )}
      {activeTab === 'tracker' && <StudentTrackerPage applications={applications} />}
      {activeTab === 'resume_ats' && <StudentResumeATSPage />}
      {activeTab === 'wellness' && <StudentWellnessSuitePage />}
      {activeTab === 'year' && <StudentYearScreenPage />}
      {activeTab === 'notif' && <StudentNotificationsPage />}
      {activeTab === 'chat' && <StudentRoleChatPage />}
      {activeTab === 'profile' && <StudentProfilePage />}
      {activeTab === 'settings' && <StudentSettingsPage />}
      {activeTab === 'consents' && <StudentConsentPage />}

      {/* Brevo Email OTP Guard Modal */}
      <RegisterOtpModal 
        isOpen={showOtpModal} 
        onClose={() => setShowOtpModal(false)}
        onVerified={() => fetchStudentData()}
      />
    </div>
  );
}

export default StudentDashboard;
