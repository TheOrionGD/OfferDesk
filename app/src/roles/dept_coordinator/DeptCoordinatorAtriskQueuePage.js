import React from "react";
import { useTenant } from "../../context/TenantContext";

export function DeptCoordinatorAtriskQueuePage({ students = [] }) {
  const { currentTenant } = useTenant();

  const atRiskStudents = students.filter(s => (s.backlogs || 0) > 0 || (s.gpa || 8.0) < 7.0 || !s.verifiedByDept);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 7 OF 10 • AT-RISK CANDIDATE QUEUE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">At-Risk Student Queue & Remedial Action Planner</h1>
        <p className="text-xs text-slate-500">Students with active backlogs or low CGPA cutoffs in {currentTenant?.name}</p>

        <div className="space-y-3">
          {atRiskStudents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              🎉 No students currently flagged in the At-Risk Queue for {currentTenant?.name}!
            </div>
          ) : (
            atRiskStudents.map(s => (
              <div key={s._id || s.id} className="p-4 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{s.name} ({s.email})</h4>
                  <p className="text-xs text-rose-700 font-bold mt-0.5">CGPA: {s.gpa || ''} • Standing Backlogs: {s.backlogs || 0}</p>
                </div>
                <span className="neu-chip-inactive text-rose-800 border-rose-300 font-bold text-xs">
                  REMEDIAL TUTORING ASSIGNED
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DeptCoordinatorAtriskQueuePage;
