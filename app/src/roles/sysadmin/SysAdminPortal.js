import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import {
  FaServer, FaCogs, FaShieldAlt, FaUsers, FaPlus, FaBuilding,
  FaDatabase, FaLock, FaUniversity
} from 'react-icons/fa';

import SysAdminOverviewPage from "./SysAdminOverviewPage";
import SysAdminTenantProvisioningPage from "./SysAdminTenantProvisioningPage";
import SysAdminTenantListPage from "./SysAdminTenantListPage";
import SysAdminUserManagementPage from "./SysAdminUserManagementPage";
import SysAdminDatabasePage from "./SysAdminDatabasePage";
import SysAdminRestApiLogsPage from "./SysAdminRestApiLogsPage";
import SysAdminSecurityGuardPage from "./SysAdminSecurityGuardPage";
import SysAdminStorageManagerPage from "./SysAdminStorageManagerPage";
import SysAdminSystemConfigPage from "./SysAdminSystemConfigPage";
import SysAdminAuditTrailPage from "./SysAdminAuditTrailPage";

export function SysAdminPortal() {
  const { user } = useAuth();
  const { currentTenant, tenants } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  const navItems = [
    { key: 'overview',    title: '1. Overview',          icon: <FaServer /> },
    { key: 'provision',   title: '2. Provision Tenant',  icon: <FaPlus /> },
    { key: 'tenant_list', title: '3. Tenant List',        icon: <FaBuilding /> },
    { key: 'users',       title: '4. Global Users',       icon: <FaUsers /> },
    { key: 'database',    title: '5. DB Collections',     icon: <FaDatabase /> },
    { key: 'api_logs',    title: '6. REST API Logs',      icon: <FaServer /> },
    { key: 'security',    title: '7. Security & OTP',     icon: <FaShieldAlt /> },
    { key: 'storage',     title: '8. Base64 Storage',     icon: <FaDatabase /> },
    { key: 'config',      title: '9. System Env',         icon: <FaCogs /> },
    { key: 'audit',       title: '10. Audit Trail',       icon: <FaLock /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Slate Dark) ───────────────────────────── */}
      <div className="role-banner role-banner--sysadmin">
        <div className="role-banner-left">
          <span className="role-badge role-badge--sysadmin">
            <FaShieldAlt /> SaaS Super Admin
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'SysAdmin'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              Global Platform — {tenants.length} Tenants
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b' }}>
            Active Tenant: {currentTenant?.code || 'None'}
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
              activeTab === item.key ? 'neu-chip-active--sysadmin' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'overview' && (
        <SysAdminOverviewPage onOpenProvisionModal={() => setActiveTab('provision')} />
      )}
      {activeTab === 'provision' && <SysAdminTenantProvisioningPage />}
      {activeTab === 'tenant_list' && <SysAdminTenantListPage />}
      {activeTab === 'users' && <SysAdminUserManagementPage />}
      {activeTab === 'database' && <SysAdminDatabasePage />}
      {activeTab === 'api_logs' && <SysAdminRestApiLogsPage />}
      {activeTab === 'security' && <SysAdminSecurityGuardPage />}
      {activeTab === 'storage' && <SysAdminStorageManagerPage />}
      {activeTab === 'config' && <SysAdminSystemConfigPage />}
      {activeTab === 'audit' && <SysAdminAuditTrailPage />}
    </div>
  );
}

export default SysAdminPortal;
