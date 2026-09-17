import React from "react";
import { useTenant } from "../../context/TenantContext";

export function DeptCoordinatorSignoffPage({ students = [], onToggleVerification }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 3 OF 10 • ACADEMIC SIGNOFF CONSOLE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Official Academic Sign-Off & CGPA Verification</h1>
        <p className="text-xs text-slate-500">Sign off student academic records & backlog eligibility for {currentTenant?.name}</p>

        <div className="space-y-3">
          {students.map(s => (
            <div key={s._id || s.id} className="p-5 neu-card flex justify-between items-center flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{s.name} ({s.email})</h4>
                <p className="text-xs text-slate-600 mt-0.5">Academic CGPA: <strong>{s.gpa || 8.0} / 10.0</strong> • Backlogs: <strong>{s.backlogs || 0}</strong></p>
              </div>

              <button 
                onClick={() => onToggleVerification(s._id || s.id)}
                className="neu-btn-primary text-xs font-bold"
              >
                {s.verifiedByDept ? 'Revoke Academic Sign-Off' : 'Grant Academic Sign-Off'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeptCoordinatorSignoffPage;
