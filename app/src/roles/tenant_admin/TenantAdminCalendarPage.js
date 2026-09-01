import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaPlus, FaClock, FaCalendarTimes } from "react-icons/fa";
import axios from "axios";

export function TenantAdminCalendarPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', venue: 'Main Auditorium', company: '' });
  const [showModal, setShowModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchEvents = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/jobs?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.jobs) {
        const mapped = res.data.jobs.map(j => ({
          id: j._id || j.id,
          title: `${j.company} - ${j.title}`,
          date: j.createdAt ? new Date(j.createdAt).toISOString().split('T')[0] : '2026-08-15',
          venue: j.location || '',
          company: j.company
        }));
        setEvents(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch calendar events:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    const added = {
      id: Date.now().toString(),
      ...newEvent
    };
    setEvents(prev => [added, ...prev]);
    setNewEvent({ title: '', date: '', venue: 'Main Auditorium', company: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 5 OF 10 • MASTER PLACEMENT CALENDAR</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Master Campus Placement Drive Calendar</h1>
            <p className="text-xs text-slate-500">Schedule drive presentations, coding tests, and interview venues for {currentTenant?.name || ''}</p>
          </div>

          <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Schedule Placement Event
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading placement calendar events...</div>
        ) : events.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaCalendarTimes className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Placement Events Scheduled Yet</h4>
            <p className="text-xs text-slate-500">Use the "Schedule Placement Event" button above to add new drive dates and venues.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(ev => (
              <div key={ev.id} className="p-5 neu-card space-y-2">
                <div className="flex justify-between items-center">
                  <span className="neu-chip-active text-[10px] py-0.5 px-2">{ev.company || ''}</span>
                  <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                    <FaClock className="text-emerald-600" /> {ev.date}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{ev.title}</h4>
                <p className="text-xs text-slate-600">Venue: <strong>{ev.venue}</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Schedule Campus Placement Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Company Partner</label>
                <input 
                  type="text" required
                  placeholder="e.g. Google Cloud"
                  value={newEvent.company}
                  onChange={(e) => setNewEvent({ ...newEvent, company: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Event Title & Round</label>
                <input 
                  type="text" required
                  placeholder="e.g. Core OS PPT & Written Technical Round"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Event Date</label>
                  <input 
                    type="date" required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Campus Venue</label>
                  <input 
                    type="text" required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TenantAdminCalendarPage;
