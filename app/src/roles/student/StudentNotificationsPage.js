import React from 'react';
import NotificationCenter from '../../components/NotificationCenter';
import NoticeBoard from '../../components/NoticeBoard';

export function StudentNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 7 OF 10 • NOTIFICATIONS & CAMPUS NOTICES</span>
        <span className="text-xs text-slate-500 font-bold">24-Hour Notice Board & Alerts</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationCenter />
        <NoticeBoard />
      </div>
    </div>
  );
}

export default StudentNotificationsPage;
