import React from "react";

export function SysAdminSecurityGuardPage() {
  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 7 OF 10 • JWT SECURITY & BREVO OTP GUARD</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Platform Security & Authentication Diagnostics</h1>
        <p className="text-xs text-slate-500">JWT token logs, Brevo SMTP verification logs & CORS policies</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 neu-card space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-700">Brevo Email OTP Guard Status</h4>
            <div className="text-xs text-emerald-700 font-bold">API Key Verified & Active</div>
            <p className="text-xs text-slate-600">SMTP Host: smtp-relay.brevo.com (Port 587)</p>
          </div>

          <div className="p-5 neu-card space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-700">JWT Token Security</h4>
            <div className="text-xs text-emerald-700 font-bold">Algorithm: HS256 (Expires 24h)</div>
            <p className="text-xs text-slate-600">CORS Policy: Strict Allowed Origins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SysAdminSecurityGuardPage;
