import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap, FaSearch, FaUserCheck, FaFileAlt, FaBookOpen, FaProjectDiagram, FaExclamationTriangle, FaUserTag, FaCogs, FaUniversity, FaMapMarkerAlt, FaFileSignature } from 'react-icons/fa';
import axios from 'axios';

import DeptCoordinatorOverviewPage from "./DeptCoordinatorOverviewPage";
import DeptCoordinatorRosterPage from "./DeptCoordinatorRosterPage";
import DeptCoordinatorSignoffPage from "./DeptCoordinatorSignoffPage";
import DeptCoordinatorBranchClearancePage from "./DeptCoordinatorBranchClearancePage";
import DeptCoordinatorSkillAuditPage from "./DeptCoordinatorSkillAuditPage";
import DeptCoordinatorProjectCreditsPage from "./DeptCoordinatorProjectCreditsPage";
import DeptCoordinatorAtriskQueuePage from "./DeptCoordinatorAtriskQueuePage";
import DeptCoordinatorAdvisorsPage from "./DeptCoordinatorAdvisorsPage";
import DeptCoordinatorNonPlacementPage from "./DeptCoordinatorNonPlacementPage";
import DeptCoordinatorSettingsPage from "./DeptCoordinatorSettingsPage";
import DeptCoordinatorGeofencePage from "./DeptCoordinatorGeofencePage";
import DeptCoordinatorAcceptancePage from "./DeptCoordinatorAcceptancePage";

export function DeptCoordinatorDashboard() {
  const { currentTenant, backendError: tenantError } = useTenant();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchDepartmentStudents = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/api/dept/students?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.students) setStudents(res.data.students);
    } catch (e) {
      setErrorMsg('⚠️ Service Disconnected: Unable to fetch department student roster. Backend REST API on port 5001 is offline.');
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchDepartmentStudents();
  }, [fetchDepartmentStudents]);

  const toggleVerification = async (studentId) => {
    try {
      await axios.patch(`${API_URL}/api/dept/students/${studentId}/verify`);
      fetchDepartmentStudents();
    } catch (e) {
      setErrorMsg('⚠️ Failed to update student sign-off state: Backend REST service is offline.');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student account from the system?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${studentId}?actorRole=dept_coordinator`);
      fetchDepartmentStudents();
    } catch (e) {
      setErrorMsg('⚠️ Failed to delete student account.');
    }
  };

  const navItems = [
    { key: 'overview',      title: '1. HOD Overview',           icon: <FaGraduationCap /> },
    { key: 'roster',        title: '2. Student Roster',          icon: <FaSearch /> },
    { key: 'signoff',       title: '3. Academic Sign-off',       icon: <FaUserCheck /> },
    { key: 'clearance',     title: '4. Branch Clearance',        icon: <FaFileAlt /> },
    { key: 'skills',        title: '5. Skill Audit',             icon: <FaBookOpen /> },
    { key: 'projects',      title: '6. Project Credits',         icon: <FaProjectDiagram /> },
    { key: 'atrisk',        title: '7. At-Risk Queue',           icon: <FaExclamationTriangle /> },
    { key: 'advisors',      title: '8. Advisor Allocation',      icon: <FaUserTag /> },
    { key: 'geofence',      title: '9. Training Geofence',       icon: <FaMapMarkerAlt /> },
    { key: 'acceptance',    title: '10. Acceptance Matrix',      icon: <FaFileSignature /> },
    { key: 'nonplacement',  title: '11. Non-Placement Tracks',   icon: <FaBookOpen /> },
    { key: 'settings',      title: '12. HOD Settings',           icon: <FaCogs /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Indigo) ────────────────────────────────── */}
      <div className="role-banner role-banner--dept_coordinator">
        <div className="role-banner-left">
          <span className="role-badge role-badge--dept_coordinator">
            <FaGraduationCap /> HOD / Faculty
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Faculty Coordinator'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4338ca' }}>
            {students.length} Students in Dept
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

      {/* 12 Sub-Page Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === item.key ? 'neu-chip-active--dept_coordinator' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'overview' && <DeptCoordinatorOverviewPage students={students} />}
      {activeTab === 'roster' && (
        <DeptCoordinatorRosterPage 
          students={students}
          onToggleVerification={toggleVerification}
          onDeleteStudent={handleDeleteStudent}
        />
      )}
      {activeTab === 'signoff' && (
        <DeptCoordinatorSignoffPage students={students} onToggleVerification={toggleVerification} />
      )}
      {activeTab === 'clearance' && <DeptCoordinatorBranchClearancePage />}
      {activeTab === 'skills' && <DeptCoordinatorSkillAuditPage />}
      {activeTab === 'projects' && <DeptCoordinatorProjectCreditsPage />}
      {activeTab === 'atrisk' && <DeptCoordinatorAtriskQueuePage students={students} />}
      {activeTab === 'advisors' && <DeptCoordinatorAdvisorsPage />}
      {activeTab === 'geofence' && <DeptCoordinatorGeofencePage students={students} />}
      {activeTab === 'acceptance' && <DeptCoordinatorAcceptancePage students={students} />}
      {activeTab === 'nonplacement' && <DeptCoordinatorNonPlacementPage />}
      {activeTab === 'settings' && <DeptCoordinatorSettingsPage />}
    </div>
  );
}

export default DeptCoordinatorDashboard;
