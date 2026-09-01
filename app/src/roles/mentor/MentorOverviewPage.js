import React from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaCalendarAlt } from "react-icons/fa";

export function MentorOverviewPage({ sessions = [], referrals = [], onOpenBooking }) {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  // All stats derived from real live data — no hardcoded numbers
  const bookedSessions = sessions.length;
  const uniqueMentees = new Set(sessions.map((s) => s.studentId || s.student).filter(Boolean)).size;
  const referralCount = referrals.length;

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">MENTORSHIP &amp; CAREER HUB</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Mentorship Command Center</h1>
          <p className="text-xs text-slate-600 mt-1">
            Mentor: <strong className="text-emerald-700">{user?.name || "Mentor"}</strong> •{" "}
            Institutional Mentorship for {currentTenant?.name}
          </p>
        </div>
        <button onClick={onOpenBooking} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
          <FaCalendarAlt /> Book Mentorship Session
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Booked Sessions</div>
          <div className="text-3xl font-extrabold text-slate-800 my-1">{bookedSessions}</div>
          <div className="text-[11px] text-emerald-700 font-bold">1-on-1 Mentorships</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Unique Mentees</div>
          <div className="text-3xl font-extrabold text-emerald-600 my-1">{uniqueMentees}</div>
          <div className="text-[11px] text-emerald-700 font-bold">Active Mentees</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Referrals Submitted</div>
          <div className="text-3xl font-extrabold text-purple-600 my-1">{referralCount}</div>
          <div className="text-[11px] text-purple-700 font-bold">Corporate Referrals</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Confirmed Sessions</div>
          <div className="text-3xl font-extrabold text-amber-500 my-1">
            {sessions.filter((s) => s.status === "CONFIRMED" || s.status === "BOOKED").length}
          </div>
          <div className="text-[11px] text-amber-700 font-bold">Confirmed Bookings</div>
        </div>
      </div>
    </div>
  );
}

export default MentorOverviewPage;
