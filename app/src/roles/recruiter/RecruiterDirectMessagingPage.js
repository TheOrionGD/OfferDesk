import React from 'react';
import RoleHierarchyChat from '../student/RoleHierarchyChat';

export function RecruiterDirectMessagingPage() {
  return (
    <div className="space-y-6">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 7 OF 10 • RECRUITER DIRECT MESSAGING</span>
        <span className="text-xs text-slate-500 font-bold">Direct Messaging with Applicants & TPO</span>
      </div>
      <RoleHierarchyChat />
    </div>
  );
}

export default RecruiterDirectMessagingPage;
