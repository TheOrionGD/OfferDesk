import React from 'react';
import SysAdminTenantProvisioning from './SysAdminTenantProvisioning';

export function SysAdminTenantProvisioningPage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 2 OF 10 • INSTITUTION TENANT PROVISIONING</span>
        <span className="text-xs text-slate-500 font-bold">Onboard University Tenants & Subdomains</span>
      </div>
      <SysAdminTenantProvisioning />
    </div>
  );
}

export default SysAdminTenantProvisioningPage;
