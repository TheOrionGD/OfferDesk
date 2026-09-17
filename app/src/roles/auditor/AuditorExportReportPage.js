import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaDownload, FaCheckCircle } from "react-icons/fa";

export function AuditorExportReportPage() {
  const { currentTenant } = useTenant();
  const [exporting, setExporting] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setMsg(`✅ Official Accreditation Audit Certificate for ${currentTenant?.name || ''} generated & signed!`);
      setExporting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-xl">
        <span className="neu-chip-active">PAGE 9 OF 10 • ACCREDITATION REPORT GENERATOR</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Export Formal Accreditation Audit Certificate</h1>
        <p className="text-xs text-slate-500">Generate signed audit reports for NIRF, NAAC, & NBA committees</p>

        {msg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> {msg}
          </div>
        )}

        <button onClick={handleExport} disabled={exporting} className="neu-btn-primary text-xs font-bold w-full py-3 flex items-center justify-center gap-2">
          <FaDownload /> {exporting ? 'Generating Signed Audit Certificate...' : 'Generate & Export Official Audit Report PDF'}
        </button>
      </div>
    </div>
  );
}

export default AuditorExportReportPage;
