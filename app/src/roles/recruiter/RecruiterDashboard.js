import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import {
  FaBriefcase, FaPlus, FaRobot, FaUsers, FaCalendarAlt,
  FaSearch, FaComments, FaFileSignature, FaChartBar, FaBuilding,
  FaExclamationTriangle, FaUniversity
} from "react-icons/fa";

import RecruiterOverviewPage from "./RecruiterOverviewPage";
import RecruiterPostDrivePage from "./RecruiterPostDrivePage";
import RecruiterAtsMatcherPage from "./RecruiterAtsMatcherPage";
import RecruiterApplicantPipelinePage from "./RecruiterApplicantPipelinePage";
import RecruiterSlotManagerPage from "./RecruiterSlotManagerPage";
import RecruiterCandidateSearchPage from "./RecruiterCandidateSearchPage";
import RecruiterDirectMessagingPage from "./RecruiterDirectMessagingPage";
import RecruiterOfferIssuerPage from "./RecruiterOfferIssuerPage";
import RecruiterAnalyticsPage from "./RecruiterAnalyticsPage";
import RecruiterCompanyProfilePage from "./RecruiterCompanyProfilePage";

export function RecruiterDashboard() {
  const { currentTenant, backendError: tenantError } = useTenant();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchDashboardData = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/api/jobs?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.jobs) setJobs(res.data.jobs);
    } catch (e) {
      setErrorMsg("⚠️ Service Currently Unavailable: Unable to fetch recruiter drives. Backend REST API on port 5001 is offline.");
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const navItems = [
    { key: 'overview',          title: '1. Overview',           icon: <FaBriefcase /> },
    { key: 'post_drive',        title: '2. Post Drive',          icon: <FaPlus /> },
    { key: 'ats',               title: '3. AI ATS Matcher',      icon: <FaRobot /> },
    { key: 'pipeline',          title: '4. Applicant Pipeline',  icon: <FaUsers /> },
    { key: 'slots',             title: '5. Slot Manager',        icon: <FaCalendarAlt /> },
    { key: 'candidate_search',  title: '6. Candidate Search',    icon: <FaSearch /> },
    { key: 'messaging',         title: '7. Direct Messaging',    icon: <FaComments /> },
    { key: 'offers',            title: '8. Offer Issuer',        icon: <FaFileSignature /> },
    { key: 'analytics',         title: '9. Drive Analytics',     icon: <FaChartBar /> },
    { key: 'company',           title: '10. Company Profile',    icon: <FaBuilding /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Cobalt Blue) ──────────────────────────── */}
      <div className="role-banner role-banner--recruiter">
        <div className="role-banner-left">
          <span className="role-badge role-badge--recruiter">
            <FaBriefcase /> Recruiter Portal
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Recruiter'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b' }}>
            {jobs.length} Active Drives
          </span>
        </div>
      </div>

      {/* Service Alert Banner */}
      {(errorMsg || tenantError) && (
        <div className="p-4 neu-card bg-rose-50 border-rose-300 text-rose-800 font-semibold text-xs flex items-center gap-3">
          <FaExclamationTriangle className="text-rose-500 text-lg shrink-0" />
          <div>{errorMsg || tenantError}</div>
        </div>
      )}

      {/* 10 Sub-Page Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === item.key ? 'neu-chip-active--recruiter' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'overview' && (
        <RecruiterOverviewPage jobs={jobs} onNavigateTab={(tabKey) => setActiveTab(tabKey)} />
      )}
      {activeTab === 'post_drive' && (
        <RecruiterPostDrivePage onDrivePosted={() => fetchDashboardData()} />
      )}
      {activeTab === 'ats' && <RecruiterAtsMatcherPage jobs={jobs} />}
      {activeTab === 'pipeline' && <RecruiterApplicantPipelinePage />}
      {activeTab === 'slots' && <RecruiterSlotManagerPage />}
      {activeTab === 'candidate_search' && <RecruiterCandidateSearchPage />}
      {activeTab === 'messaging' && <RecruiterDirectMessagingPage />}
      {activeTab === 'offers' && <RecruiterOfferIssuerPage />}
      {activeTab === 'analytics' && <RecruiterAnalyticsPage jobs={jobs} />}
      {activeTab === 'company' && <RecruiterCompanyProfilePage />}
    </div>
  );
}

export default RecruiterDashboard;
