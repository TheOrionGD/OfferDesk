import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaGraduationCap, FaCheckDouble, FaFilter, FaUsers, FaExclamationTriangle, FaCalendarAlt, FaBullhorn, FaFileSignature, FaCogs, FaAward, FaUniversity } from 'react-icons/fa';
import axios from 'axios';

import TenantAdminOverviewPage from "./TenantAdminOverviewPage";
import TenantAdminDriveAuthPage from "./TenantAdminDriveAuthPage";
import TenantAdminEligibilityPage from "./TenantAdminEligibilityPage";
import TenantAdminRecruitersPage from "./TenantAdminRecruitersPage";
import TenantAdminCalendarPage from "./TenantAdminCalendarPage";
import TenantAdminAnalyticsPage from "./TenantAdminAnalyticsPage";
import TenantAdminNoticeBroadcastPage from "./TenantAdminNoticeBroadcastPage";
import TenantAdminOfferVerificationPage from "./TenantAdminOfferVerificationPage";
import TenantAdminNirfExporterPage from "./TenantAdminNirfExporterPage";
import TenantAdminCellSettingsPage from "./TenantAdminCellSettingsPage";

export function TenantAdminDashboard() {
  const { currentTenant, backendError: tenantError } = useTenant();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('officer');
  const [drives, setDrives] = useState([]);
  const [notices, setNotices] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showDriveModal, setShowDriveModal] = useState(false);

  const [newDrive, setNewDrive] = useState({
    title: '', company: '', minGpa: 7.0, eligibleBranches: 'CSE, IT', location: '', salary: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchDrives = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setErrorMsg(null);
    try {
      const [jRes, nRes, uRes] = await Promise.all([
        axios.get(`${API_URL}/api/jobs?tenantId=${currentTenant.tenantId}`),
        axios.get(`${API_URL}/api/notices?tenantId=${currentTenant.tenantId}`),
        axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`)
      ]);
      if (jRes.data && jRes.data.jobs) setDrives(jRes.data.jobs);
      if (nRes.data && nRes.data.notices) setNotices(nRes.data.notices);
      if (uRes.data && uRes.data.users) setUsersList(uRes.data.users);
    } catch (e) {
      setErrorMsg('⚠️ Service Currently Unavailable: Unable to fetch dashboard data. Backend REST API on port 5001 is offline.');
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const handlePreRegisterUser = async (userForm) => {
    if (!currentTenant?.tenantId) return;
    try {
      await axios.post(`${API_URL}/api/users`, {
        ...userForm,
        tenantId: currentTenant.tenantId,
        creatorRole: user?.role,
        creatorName: user?.name
      });
      fetchDrives();
    } catch (e) {
      setErrorMsg(e.response?.data?.error || '⚠️ Pre-registration failed.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account from the system?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${userId}?actorRole=${user?.role || ''}&actorName=${encodeURIComponent(user?.name || '')}`);
      fetchDrives();
    } catch (e) {
      setErrorMsg('⚠️ User deletion failed.');
    }
  };

  const handlePostNotice = async (noticeForm) => {
    if (!currentTenant?.tenantId) return;
    try {
      await axios.post(`${API_URL}/api/notices`, {
        tenantId: currentTenant.tenantId,
        title: noticeForm.title,
        content: noticeForm.content,
        category: noticeForm.category || '',
        postedBy: user?.name,
        postedByRole: user?.role
      });
      fetchDrives();
    } catch (e) {
      setErrorMsg('⚠️ Notice broadcast failed: REST API offline.');
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!newDrive.title || !newDrive.company) return;
    if (!currentTenant?.tenantId) return;
    try {
      await axios.post(`${API_URL}/api/jobs`, {
        tenantId: currentTenant.tenantId,
        recruiterId: user?.id || user?._id,
        recruiterName: user?.name,
        recruiterRole: user?.role,
        title: newDrive.title,
        company: newDrive.company,
        minGpa: parseFloat(newDrive.minGpa || 0),
        eligibleBranches: newDrive.eligibleBranches ? newDrive.eligibleBranches.split(',').map(b => b.trim()) : [],
        location: newDrive.location || 'Campus / Remote',
        salary: newDrive.salary || '',
        description: 'Authorized by College Placement Officer.',
        approvedByTenantAdmin: true
      });
      setShowDriveModal(false);
      setNewDrive({ title: '', company: '', minGpa: 7.0, eligibleBranches: 'CSE, IT', location: '', salary: '' });
      fetchDrives();
    } catch (e) {
      setErrorMsg('⚠️ Failed to authorize drive: REST API offline.');
    }
  };

  const toggleApproval = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/jobs/${id}/approve`);
      fetchDrives();
    } catch (e) {
      setErrorMsg('⚠️ Failed to toggle drive approval state.');
    }
  };

  const navItems = [
    { key: 'officer',       title: '1. Officer Center',       icon: <FaUserShield /> },
    { key: 'authorization', title: '2. Drive Auth',            icon: <FaFilter /> },
    { key: 'eligibility',   title: '3. Eligibility Engine',   icon: <FaCheckDouble /> },
    { key: 'recruiters',    title: '4. User Directory',        icon: <FaUsers /> },
    { key: 'calendar',      title: '5. Drive Calendar',        icon: <FaCalendarAlt /> },
    { key: 'analytics',     title: '6. Hiring Analytics',      icon: <FaGraduationCap /> },
    { key: 'notices',       title: '7. Notice Broadcast',      icon: <FaBullhorn /> },
    { key: 'offers',        title: '8. Offer Verification',    icon: <FaFileSignature /> },
    { key: 'nirf',          title: '9. NIRF Exporter',         icon: <FaAward /> },
    { key: 'settings',      title: '10. Cell Settings',        icon: <FaCogs /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Amber / Orange) ───────────────────────── */}
      <div className="role-banner role-banner--tenant_admin">
        <div className="role-banner-left">
          <span className="role-badge role-badge--tenant_admin">
            <FaUserShield /> Placement Officer
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Tenant Admin'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#92400e' }}>
            {drives.length} Drives · {usersList.length} Users
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
              activeTab === item.key ? 'neu-chip-active--tenant_admin' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'officer' && (
        <TenantAdminOverviewPage drives={drives} onOpenDriveModal={() => setShowDriveModal(true)} />
      )}
      {activeTab === 'authorization' && (
        <TenantAdminDriveAuthPage drives={drives} onToggleApproval={toggleApproval} />
      )}
      {activeTab === 'eligibility' && <TenantAdminEligibilityPage />}
      {activeTab === 'recruiters' && (
        <TenantAdminRecruitersPage 
          usersList={usersList}
          onPreRegisterUser={handlePreRegisterUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
      {activeTab === 'calendar' && <TenantAdminCalendarPage />}
      {activeTab === 'analytics' && <TenantAdminAnalyticsPage />}
      {activeTab === 'notices' && (
        <TenantAdminNoticeBroadcastPage notices={notices} onPostNotice={handlePostNotice} />
      )}
      {activeTab === 'offers' && <TenantAdminOfferVerificationPage />}
      {activeTab === 'nirf' && <TenantAdminNirfExporterPage />}
      {activeTab === 'settings' && <TenantAdminCellSettingsPage />}

      {/* Drive Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Authorize Campus Recruitment Drive</h3>
            <form onSubmit={handleCreateDrive} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Drive Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Core OS Engineering Drive" 
                  value={newDrive.title}
                  onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Company Partner</label>
                <input 
                  type="text" required
                  placeholder="Company Name" 
                  value={newDrive.company}
                  onChange={(e) => setNewDrive({ ...newDrive, company: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Min CGPA</label>
                  <input 
                    type="number" step="0.1"
                    value={newDrive.minGpa}
                    onChange={(e) => setNewDrive({ ...newDrive, minGpa: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Branches</label>
                  <input 
                    type="text" 
                    value={newDrive.eligibleBranches}
                    onChange={(e) => setNewDrive({ ...newDrive, eligibleBranches: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowDriveModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Authorize Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TenantAdminDashboard;
