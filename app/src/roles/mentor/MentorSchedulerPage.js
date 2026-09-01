import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaCheckCircle } from "react-icons/fa";

export function MentorSchedulerPage({ sessions = [] }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 2 OF 10 • SESSION SCHEDULER</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Scheduled Mentorship Sessions</h1>
        <p className="text-xs text-slate-500">Scheduled 1-on-1 career guidance sessions for {currentTenant?.name}</p>

        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              No mentorship sessions scheduled yet for {currentTenant?.name}.
            </div>
          ) : (
            sessions.map(s => (
              <div key={s._id || s.id} className="p-5 neu-card flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{s.topic}</h4>
                  <p className="text-xs text-slate-600 mt-1">Mentee Student ID: <strong className="text-emerald-700">{s.studentId}</strong></p>
                  <span className="text-xs text-slate-500 font-mono mt-1 block">{s.scheduledDate} at {s.scheduledTime}</span>
                </div>
                <span className="neu-chip-active text-xs flex items-center gap-1">
                  <FaCheckCircle /> {s.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorSchedulerPage;
