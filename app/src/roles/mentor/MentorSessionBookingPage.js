import React from 'react';
import MentorSessionBooking from './MentorSessionBooking';

export function MentorSessionBookingPage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 3 OF 10 • 1-ON-1 SESSION BOOKING</span>
        <span className="text-xs text-slate-500 font-bold">Mentorship Appointment Confirmations</span>
      </div>
      <MentorSessionBooking />
    </div>
  );
}

export default MentorSessionBookingPage;
