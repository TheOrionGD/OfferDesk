import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaBriefcase, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
import PlacementAnxietyIndex from '../wellness/PlacementAnxietyIndex';
import axios from 'axios';
import { useTenant } from '../../../context/TenantContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function JuniorMockTestScreen() {
  const { currentTenant } = useTenant();
  const [showMentalHealth, setShowMentalHealth] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [drives, setDrives] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!currentTenant?.tenantId) return;
    Promise.all([
      axios.get(`${API_BASE_URL}/api/mentorships?tenantId=${currentTenant.tenantId}`),
      axios.get(`${API_BASE_URL}/api/jobs?tenantId=${currentTenant.tenantId}`)
    ])
      .then(([mRes, jRes]) => {
        if (mRes.data && mRes.data.sessions) setSessions(mRes.data.sessions);
        if (jRes.data && jRes.data.jobs) setDrives(jRes.data.jobs);
      })
      .catch(() => {
        setErrorMsg('⚠️ Service Currently Unavailable: REST Backend API is offline.');
      });
  }, [currentTenant]);

  return (
    <div className="p-6 rounded-2xl border border-purple-500/30 bg-slate-900/90 text-white shadow-2xl space-y-6">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="p-5 border-l-4 border-purple-500 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold rounded-full uppercase">
              Academic Year 3 • Junior Candidate
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">Junior Pre-Placement Mock & Alumni Guidance Portal</h2>
          <p className="text-xs text-gray-300 mt-1">Managing pre-placement mock readiness, 1-on-1 alumni mentorship, and active drives for {currentTenant?.name}.</p>
        </div>

        <button 
          onClick={() => setShowMentalHealth(!showMentalHealth)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
        >
          <FaHeartbeat /> {showMentalHealth ? 'Hide Pre-Placement Stress Check' : 'Pre-Placement Stress Tracker'}
        </button>
      </div>

      {showMentalHealth && <PlacementAnxietyIndex />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-purple-400 flex items-center gap-2">
            <FaUserGraduate /> 1-on-1 Scheduled Alumni Mentorship Sessions
          </h3>
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
                No alumni mentorship sessions scheduled yet for {currentTenant?.name}.
              </div>
            ) : (
              sessions.map(s => (
                <div key={s._id || s.id} className="p-4 rounded-xl bg-slate-800/70 border border-gray-700 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-purple-300">{s.topic}</span>
                    <span className="text-[10px] bg-purple-950 border border-purple-800 px-2 py-0.5 rounded text-purple-200 font-mono">{s.status}</span>
                  </div>
                  <p className="text-gray-300">Date: {s.scheduledDate} at {s.scheduledTime}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <FaBriefcase /> Pre-Final Year Placement & Summer Drives
          </h3>
          <div className="space-y-3">
            {drives.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
                No drives posted yet for {currentTenant?.name}.
              </div>
            ) : (
              drives.map(d => (
                <div key={d._id || d.id} className="p-4 rounded-xl bg-slate-800/70 border border-gray-700 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">{d.title}</span>
                    <span className="text-xs text-emerald-400 font-bold">{d.company}</span>
                  </div>
                  <p className="text-gray-300">Cutoff CGPA: {d.minGpa} • Salary: {d.salary}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JuniorMockTestScreen;
