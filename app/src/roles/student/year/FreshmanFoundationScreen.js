import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaUserGraduate, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';
import PlacementAnxietyIndex from '../wellness/PlacementAnxietyIndex';
import axios from 'axios';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function FreshmanFoundationScreen() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [showMentalHealth, setShowMentalHealth] = useState(false);
  const [notices, setNotices] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!currentTenant?.tenantId) return;
    axios.get(`${API_BASE_URL}/api/notices?tenantId=${currentTenant.tenantId}`)
      .then(res => {
        if (res.data && res.data.notices) setNotices(res.data.notices);
      })
      .catch(() => {
        setErrorMsg('⚠️ Service Currently Unavailable: REST Backend API is offline.');
      });
  }, [currentTenant]);

  return (
    <div className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/90 text-white shadow-2xl space-y-6">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="p-5 border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-bold rounded-full uppercase">
              Academic Year 1 • {user?.department || ''} Candidate
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">Freshman Foundation & Campus Transition Portal</h2>
          <p className="text-xs text-gray-300 mt-1">Managing foundational coding stress, academic department milestones, and institution notices for {currentTenant?.name}.</p>
        </div>

        <button 
          onClick={() => setShowMentalHealth(!showMentalHealth)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
        >
          <FaHeartbeat /> {showMentalHealth ? 'Hide Stress Assessment' : 'Freshman Transition Stress Tracker'}
        </button>
      </div>

      {showMentalHealth && <PlacementAnxietyIndex />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-5 rounded-xl border border-gray-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <FaBullhorn /> Live University Notices & Academic Announcements
          </h3>
          <div className="space-y-3">
            {notices.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
                No official notices broadcasted by placement cell for {currentTenant?.name} yet.
              </div>
            ) : (
              notices.map(n => (
                <div key={n._id || n.id} className="p-4 rounded-xl bg-slate-800/70 border border-gray-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-cyan-300 uppercase">{n.title}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-200">{n.content}</p>
                  <span className="text-[10px] text-gray-400 block mt-2">Posted by: <strong>{n.postedBy}</strong></span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-gray-800 bg-slate-900/80 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FaUserGraduate className="text-cyan-400" /> Freshman Academic Record
          </h3>
          <div className="p-4 rounded-lg bg-slate-800/60 border border-gray-700 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Student Name:</span>
              <strong className="text-white">{user?.name || ''}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <strong className="text-cyan-300 font-mono">{user?.email || ''}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Department:</span>
              <strong className="text-gray-200">{user?.department || ''}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Academic Year:</span>
              <strong className="text-emerald-400">Year {user?.academicYear || 1}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CGPA Status:</span>
              <strong className="text-amber-400">{user?.gpa !== undefined ? `${user.gpa} / 10.0` : 'Evaluating'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreshmanFoundationScreen;
