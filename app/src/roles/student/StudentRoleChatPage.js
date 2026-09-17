import React from 'react';
import RoleHierarchyChat from './RoleHierarchyChat';

export function StudentRoleChatPage() {
  return (
    <div className="space-y-6">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 8 OF 10 • ROLE HIERARCHY CHAT & PEER WALL</span>
        <span className="text-xs text-slate-500 font-bold">Direct Messaging with TPO & HODs</span>
      </div>

      <RoleHierarchyChat />
    </div>
  );
}

export default StudentRoleChatPage;
