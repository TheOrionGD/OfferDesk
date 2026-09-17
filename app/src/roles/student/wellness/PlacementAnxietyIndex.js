import React, { useState } from 'react';
import { FaHeartbeat, FaSmile, FaFrown, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { CapacitorService } from '../../../services/capacitorService';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function PlacementAnxietyIndex() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [moodScore, setMoodScore] = useState(7);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getStressCategory = (val) => {
    if (val <= 3) return { label: 'HIGH ANXIETY & BURNOUT RISK', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-800' };
    if (val <= 6) return { label: 'MODERATE PRE-INTERVIEW TENSION', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800' };
    return { label: 'OPTIMAL FOCUS & CONFIDENCE', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' };
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!currentTenant?.tenantId) {
      setErrorMsg('⚠️ Tenant Context Required: Please select an onboarded university tenant.');
      return;
    }
    CapacitorService.triggerHapticPulse();
    try {
      await axios.post(`${API_BASE_URL}/api/wellness/stress-entry`, {
        tenantId: currentTenant.tenantId,
        studentId: user?.id || user?._id,
        studentName: user?.name,
        studentRole: user?.role,
        moodScore,
        stressLevel: moodScore <= 3 ? 'HIGH' : (moodScore <= 6 ? 'MODERATE' : 'LOW'),
        notes
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setErrorMsg('⚠️ Failed to save assessment: Backend REST API on port 5001 is offline.');
    }
  };

  const currentCat = getStressCategory(moodScore);

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-slate-900/90 text-white shadow-xl space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
        <div className="p-3 bg-pink-950 border border-pink-700 rounded-xl text-pink-400">
          <FaHeartbeat className="text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">Placement Anxiety & Stress Self-Assessment Index</h3>
          <p className="text-xs text-gray-400">Confidential daily wellness & interview nervousness tracker</p>
        </div>
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <FaCheckCircle /> Assessment logged into MongoDB database! Your placement journey is a marathon!
        </div>
      )}

      <form onSubmit={handleSaveAssessment} className="space-y-5">
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2 flex-wrap gap-2">
            <span className="text-gray-300">How are you feeling today before your drive?</span>
            <span className={`px-2.5 py-1 rounded text-xs font-bold border ${currentCat.bg} ${currentCat.color}`}>
              {currentCat.label}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <FaFrown className="text-rose-400 text-xl" />
            <input 
              type="range" min="1" max="10" 
              value={moodScore} 
              onChange={(e) => setMoodScore(parseInt(e.target.value))}
              className="w-full accent-pink-500 bg-slate-800 rounded h-2"
            />
            <FaSmile className="text-emerald-400 text-xl" />
          </div>
          <p className="text-center font-bold text-lg text-pink-300">{moodScore} / 10</p>
        </div>

        <div>
          <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Journal Notes / Reflection</label>
          <textarea 
            rows="2"
            placeholder="e.g. Nervous about System Design round..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-800 border border-gray-700 rounded p-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-all text-xs shadow-lg"
        >
          Log Daily Placement Anxiety Assessment
        </button>
      </form>
    </div>
  );
}

export default PlacementAnxietyIndex;
