import React from 'react';
import TenantNirfExporter from './TenantNirfExporter';

export function TenantAdminNirfExporterPage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 9 OF 10 • NIRF ACCREDITATION EXPORTER</span>
        <span className="text-xs text-slate-500 font-bold">NIRF & NAAC Metric Compliance Reports</span>
      </div>
      <TenantNirfExporter />
    </div>
  );
}

export default TenantAdminNirfExporterPage;
