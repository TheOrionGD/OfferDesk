import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaPlus, FaClock, FaCalendarTimes } from "react-icons/fa";
import axios from "axios";

export function RecruiterSlotManagerPage() {
  const { currentTenant } = useTenant();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSlot, setNewSlot] = useState({ round: '', date: '', time: '10:00 AM', venue: 'Main Auditorium / Online' });
  const [showModal, setShowModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchSlots = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/evaluations/candidates?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.candidates) {
        const mapped = res.data.candidates.map((c, idx) => ({
          id: c.id || idx,
          round: c.round || '',
          date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
          time: c.time || '',
          venue: 'Virtual Room / Main Campus Auditorium',
          candidatesCount: 1
        }));
        setSlots(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch interview slots:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot.round || !newSlot.date) return;
    setSlots(prev => [{ id: Date.now().toString(), ...newSlot, candidatesCount: 0 }, ...prev]);
    setNewSlot({ round: '', date: '', time: '10:00 AM', venue: 'Main Auditorium / Online' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 5 OF 10 • INTERVIEW SLOT SCHEDULER</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Interview Round & Time Slot Scheduler</h1>
            <p className="text-xs text-slate-500">Allocate evaluation panels and campus venues for {currentTenant?.name || ''}</p>
          </div>

          <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Schedule New Interview Slot
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading interview slots...</div>
        ) : slots.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaCalendarTimes className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Interview Slots Scheduled Yet</h4>
            <p className="text-xs text-slate-500">Use the "Schedule New Interview Slot" button above to add evaluation rounds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map(s => (
              <div key={s.id} className="p-5 neu-card space-y-2">
                <div className="flex justify-between items-center">
                  <span className="neu-chip-active text-[10px] py-0.5 px-2">{s.round}</span>
                  <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                    <FaClock className="text-emerald-600" /> {s.time}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-800">Date: {s.date}</h4>
                <p className="text-xs text-slate-600">Venue: <strong>{s.venue}</strong></p>
                <div className="text-[11px] text-emerald-700 font-bold">Assigned Candidates: {s.candidatesCount} Candidates</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Schedule New Interview Slot</h3>
            <form onSubmit={handleAddSlot} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Interview Round Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Technical Round 1 (DSA & Problem Solving)"
                  value={newSlot.round}
                  onChange={(e) => setNewSlot({ ...newSlot, round: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                  <input 
                    type="date" required
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                  <input 
                    type="text" required
                    placeholder="e.g. 10:00 AM"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Venue / Online Link</label>
                <input 
                  type="text" required
                  placeholder="e.g. Computer Lab 3 / Google Meet"
                  value={newSlot.venue}
                  onChange={(e) => setNewSlot({ ...newSlot, venue: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterSlotManagerPage;
