import React from 'react';
import DeptBranchClearance from './DeptBranchClearance';

export function DeptCoordinatorBranchClearancePage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 4 OF 10 • BRANCH NO-DUES CLEARANCE</span>
        <span className="text-xs text-slate-500 font-bold">Attendance & Fee Clearance Manager</span>
      </div>
      <DeptBranchClearance />
    </div>
  );
}

export default DeptCoordinatorBranchClearancePage;
