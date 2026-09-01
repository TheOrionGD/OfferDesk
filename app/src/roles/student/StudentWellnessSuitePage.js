import React from 'react';
import StudentWellnessSuite from './StudentWellnessSuite';

export function StudentWellnessSuitePage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 5 OF 10 • STUDENT PLACEMENT WELLNESS</span>
        <span className="text-xs text-slate-500 font-bold">Mental Health & Rejection Resilience</span>
      </div>
      <StudentWellnessSuite />
    </div>
  );
}

export default StudentWellnessSuitePage;
