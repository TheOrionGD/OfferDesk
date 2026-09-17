import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { FaCalendarAlt, FaCalendarTimes } from 'react-icons/fa';
import axios from 'axios';

export function MentorSessionBooking() {
  const { currentTenant } = useTenant();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchSessions = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/mentorships?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.sessions) {
        const mapped = res.data.sessions.map((s, idx) => ({
          id: s._id || s.id || idx,
          student: s.userName || s.studentId || 'Mentee Candidate',
          topic: s.topic || 'Mock Technical System Design & Resume Coaching',
          time: `${s.scheduledDate || 'Tomorrow'} at ${s.scheduledTime || '05:00 PM'}`,
          status: s.status || 'CONFIRMED'
        }));
        setSessions(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch mentorship appointments:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const confirmSession = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'CONFIRMED' } : s));
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">MENTOR NETWORK</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">1-on-1 Mentorship Session Manager</h1>
          <p className="text-xs text-slate-600 mt-1">Schedule & Manage Mock Technical Interviews & Career Coaching Sessions for {currentTenant?.name || ''}</p>
        </div>
      </div>

      <div className="p-6 neu-card space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FaCalendarAlt className="text-emerald-600" /> Upcoming Mentorship Appointments
        </h3>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading mentorship appointments...</div>
        ) : sessions.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaCalendarTimes className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Mentorship Appointments Booked Yet</h4>
            <p className="text-xs text-slate-500">Mentee 1-on-1 session requests from students will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="p-4 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-800">{s.student}</h4>
                  <p className="text-xs text-slate-600">{s.topic} • <strong className="text-emerald-700">{s.time}</strong></p>
                </div>

                {s.status === 'CONFIRMED' ? (
                  <span className="neu-chip-active text-xs">Confirmed Appointment</span>
                ) : (
                  <button onClick={() => confirmSession(s.id)} className="neu-btn-primary text-xs font-bold">
                    Confirm Session Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorSessionBooking;
