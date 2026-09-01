import React from "react";

export function SysAdminStorageManagerPage() {
  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 8 OF 10 • BASE64 STORAGE MANAGER</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Native Base64 Document Storage Metrics</h1>
        <p className="text-xs text-slate-500">Zero-external-cloud PDF resume storage monitoring in MongoDB</p>

        <div className="p-5 neu-card bg-emerald-50/50 space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-700">Storage Engine Status</h4>
          <div className="text-sm font-extrabold text-emerald-800">Direct MongoDB Base64 Encoding Active</div>
          <p className="text-xs text-slate-600">Max Document Limit: 15MB per PDF file document.</p>
        </div>
      </div>
    </div>
  );
}

export default SysAdminStorageManagerPage;
