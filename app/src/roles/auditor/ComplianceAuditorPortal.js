import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { 
  FaFileAlt, FaLock, FaAward, FaBuilding, FaUserGraduate,
  FaExclamationTriangle, FaDownload, FaCogs, FaCheckCircle, FaShieldAlt,
  FaUniversity
} from 'react-icons/fa';

import AuditorOverviewPage from "./AuditorOverviewPage";
import AuditorSha256VerifierPage from "./AuditorSha256VerifierPage";
import AuditorPlacementAuditPage from "./AuditorPlacementAuditPage";
import AuditorCompanyVerificationPage from "./AuditorCompanyVerificationPage";
import AuditorNIRFMetricsPage from "./AuditorNIRFMetricsPage";
import AuditorNAACCriteriaPage from "./AuditorNAACCriteriaPage";
import AuditorStudentRecordsPage from "./AuditorStudentRecordsPage";
import AuditorDiscrepancyLogPage from "./AuditorDiscrepancyLogPage";
import AuditorExportReportPage from "./AuditorExportReportPage";
import AuditorSettingsPage from "./AuditorSettingsPage";

export function ComplianceAuditorPortal() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { key: 'overview',        title: '1. Overview',           icon: <FaFileAlt /> },
    { key: 'sha256',          title: '2. SHA-256 Verifier',   icon: <FaLock /> },
    { key: 'offers_audit',    title: '3. Offers Audit',        icon: <FaCheckCircle /> },
    { key: 'mou_audit',       title: '4. Employer MOUs',       icon: <FaBuilding /> },
    { key: 'nirf',            title: '5. NIRF Metrics',        icon: <FaAward /> },
    { key: 'naac',            title: '6. NAAC Criterion 5',   icon: <FaAward /> },
    { key: 'student_records', title: '7. Student Proofs',      icon: <FaUserGraduate /> },
    { key: 'exceptions',      title: '8. Discrepancies',       icon: <FaExclamationTriangle /> },
    { key: 'export',          title: '9. Export Certificate',  icon: <FaDownload /> },
    { key: 'settings',        title: '10. Auditor Settings',  icon: <FaCogs /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Teal / Cyan) ──────────────────────────── */}
      <div className="role-banner role-banner--auditor">
        <div className="role-banner-left">
          <span className="role-badge role-badge--auditor">
            <FaShieldAlt /> Compliance Auditor
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Auditor'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#0e7490' }}>
            NAAC / NIRF Audit Mode
          </span>
        </div>
      </div>

      {/* 10 Sub-Page Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === item.key ? 'neu-chip-active--auditor' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'overview' && <AuditorOverviewPage />}
      {activeTab === 'sha256' && <AuditorSha256VerifierPage />}
      {activeTab === 'offers_audit' && <AuditorPlacementAuditPage />}
      {activeTab === 'mou_audit' && <AuditorCompanyVerificationPage />}
      {activeTab === 'nirf' && <AuditorNIRFMetricsPage />}
      {activeTab === 'naac' && <AuditorNAACCriteriaPage />}
      {activeTab === 'student_records' && <AuditorStudentRecordsPage />}
      {activeTab === 'exceptions' && <AuditorDiscrepancyLogPage />}
      {activeTab === 'export' && <AuditorExportReportPage />}
      {activeTab === 'settings' && <AuditorSettingsPage />}
    </div>
  );
}

export default ComplianceAuditorPortal;
