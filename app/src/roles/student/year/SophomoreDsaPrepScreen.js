import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
import PlacementAnxietyIndex from '../wellness/PlacementAnxietyIndex';
import axios from 'axios';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function SophomoreDsaPrepScreen() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [showMentalHealth, setShowMentalHealth] = useState(false);
  const [drives, setDrives] = useState([]);
  const [stressEntries, setStressEntries] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!currentTenant?.tenantId) return;
    Promise.all([
      axios.get(`${API_BASE_URL}/api/jobs?tenantId=${currentTenant.tenantId}`),
      axios.get(`${API_BASE_URL}/api/wellness/stress-entries?tenantId=${currentTenant.tenantId}${user?.id ? `&studentId=${user.id}` : ''}`)
    ])
      .then(([jobsRes, stressRes]) => {
        if (jobsRes.data && jobsRes.data.jobs) setDrives(jobsRes.data.jobs);
        if (stressRes.data && stressRes.data.entries) setStressEntries(stressRes.data.entries);
      })
      .catch(() => {
        setErrorMsg('⚠️ Service Currently Unavailable: REST Backend API is offline.');
      });
  }, [currentTenant, user]);

  return (
    <div className="p-6 rounded-2xl border border-blue-500/30 bg-slate-900/90 text-white shadow-2xl space-y-6">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="p-5 border-l-4 border-blue-500 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-950 border border-blue-700 text-blue-300 text-xs font-bold rounded-full uppercase">
              Academic Year 2 • Sophomore Candidate
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">Sophomore DSA & Pre-Internship Readiness Portal</h2>
          <p className="text-xs text-gray-300 mt-1">Managing competitive coding stress, early backlog anxiety, and summer internship cutoffs for {currentTenant?.name}.</p>
        </div>

        <button 
          onClick={() => setShowMentalHealth(!showMentalHealth)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
        >
          <FaHeartbeat /> {showMentalHealth ? 'Hide DSA Stress Check' : 'DSA Burnout & Anxiety Tracker'}
        </button>
      </div>

      {showMentalHealth && <PlacementAnxietyIndex />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
            <FaBriefcase /> Eligible Internship & Skill Drives ({currentTenant?.code})
          </h3>
          <div className="space-y-3">
            {drives.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
                No active pre-final year campus drives posted yet for {currentTenant?.name}.
              </div>
            ) : (
              drives.map(d => (
                <div key={d._id || d.id} className="p-4 rounded-xl bg-slate-800/70 border border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-white">{d.title}</h4>
                    <span className="text-xs text-blue-300 font-bold">{d.company}</span>
                  </div>
                  <p className="text-xs text-gray-300">Min CGPA: {d.minGpa} • Location: {d.location}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-pink-400 flex items-center gap-2">
            <FaHeartbeat /> Student Logged Anxiety & Stress Entries
          </h3>
          <div className="space-y-3">
            {stressEntries.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
                No anxiety assessments logged yet. Use the tracker above to log daily readiness!
              </div>
            ) : (
              stressEntries.map(e => (
                <div key={e._id || e.id} className="p-4 rounded-xl bg-slate-800/70 border border-gray-700 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-pink-300">Mood Score: {e.moodScore} / 10</span>
                    <span className="text-[10px] text-gray-400 font-mono">{new Date(e.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-200">Notes: {e.notes || ''}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-1">{e.recommendedAction}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SophomoreDsaPrepScreen;
