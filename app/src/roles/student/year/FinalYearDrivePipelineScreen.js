import React, { useState } from 'react';
import { FaRocket, FaRobot, FaCheckCircle, FaAward, FaHeartbeat, FaBookReader } from 'react-icons/fa';
import PlacementAnxietyIndex from '../wellness/PlacementAnxietyIndex';
import axios from 'axios';
import { useTenant } from '../../../context/TenantContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function FinalYearDrivePipelineScreen() {
  const { currentTenant } = useTenant();
  const [showMentalHealth, setShowMentalHealth] = useState(false);
  const [prepMaterial, setPrepMaterial] = useState(null);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchDrivePrepMaterials = async () => {
    if (!currentTenant?.tenantId) {
      setErrorMsg('⚠️ Tenant Context Required: Please select an onboarded university tenant.');
      return;
    }
    setLoadingPrep(true);
    setErrorMsg(null);
    try {
      const jobsRes = await axios.get(`${API_BASE_URL}/api/jobs?tenantId=${currentTenant.tenantId}`);
      const activeDrive = jobsRes.data?.jobs?.[0];
      if (!activeDrive) {
        setErrorMsg('⚠️ Drive Specification Required: No active campus drives posted for this institution yet.');
        setLoadingPrep(false);
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/api/ai/prep-generator`, {
        jobId: activeDrive._id || activeDrive.id,
        tenantId: currentTenant.tenantId
      });
      if (res.data && res.data.prepMaterial) {
        setPrepMaterial(res.data.prepMaterial);
      }
    } catch (e) {
      setErrorMsg(e.response?.data?.error || '');
    } finally {
      setLoadingPrep(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/90 text-white shadow-2xl space-y-6">
      <div className="p-5 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold rounded-full uppercase">
              Academic Year 4 (Final Year Candidate)
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">Final Year Campus Placement & AI Prep Material Screen</h2>
          <p className="text-xs text-gray-300 mt-1">Empirical Research Grounding: Managing high-stakes rejection burnout, Sentence-Transformers ATS ranking, and AI study materials.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchDrivePrepMaterials}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
          >
            <FaBookReader /> Generate AI Pre-Interview Study Material
          </button>

          <button 
            onClick={() => setShowMentalHealth(!showMentalHealth)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
          >
            <FaHeartbeat /> {showMentalHealth ? 'Hide Placement Stress Check' : 'Placement Stress & Burnout Recovery'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xl">
          <FaAward className="text-rose-400 text-base" />
          <div>{errorMsg}</div>
        </div>
      )}

      {showMentalHealth && <PlacementAnxietyIndex />}

      {/* AI Pre-Interview Study Materials Drawer */}
      {loadingPrep && (
        <div className="p-4 bg-slate-800 border border-emerald-500/50 rounded-xl text-center text-xs text-emerald-300">
          Analyzing company drive specifications and generating customized pre-interview study topics...
        </div>
      )}

      {prepMaterial && (
        <div className="p-5 bg-slate-800/80 border border-emerald-500/50 rounded-xl space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <FaBookReader /> AI-Generated Pre-Interview Study Guide: {prepMaterial.company} ({prepMaterial.jobTitle})
          </h3>

          <div>
            <h4 className="text-xs font-bold uppercase text-gray-300 mb-2">Core Technical Focus Areas</h4>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
              {prepMaterial.technicalTopics.map((top, i) => (
                <li key={i}><strong className="text-emerald-300">{top}</strong></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-gray-300 mb-2">Drive Sample Technical Questions & Answer Keys</h4>
            <div className="space-y-2">
              {prepMaterial.sampleQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded border border-gray-700 text-xs">
                  <p className="font-bold text-white mb-1">Q{i+1}: {q.question}</p>
                  <p className="text-gray-300"><strong className="text-amber-400">Answer Key Focus:</strong> {q.recommendedAnswerKey}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/70 border border-gray-700">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <FaRocket /> 1. High-Stakes Drive Pipeline
          </div>
          <p className="text-xs text-gray-300">1-Click Apply to authorized Google, Meta, and Goldman Sachs drives.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/70 border border-gray-700">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <FaRobot /> 2. AI ATS Vector Matcher
          </div>
          <p className="text-xs text-gray-300">Sentence-Transformers NLP candidate ranking & match score breakdown.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/70 border border-gray-700">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <FaCheckCircle /> 3. Live Scorecard Sync
          </div>
          <p className="text-xs text-gray-300">Real-time interview evaluator ratings synced to recruiter pipeline.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/70 border border-gray-700">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <FaAward /> 4. Offer Letter Acceptance
          </div>
          <p className="text-xs text-gray-300">Accept/Decline official offers & upload proof for NAAC NIRF verification.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/70 border border-gray-700 md:col-span-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <FaHeartbeat /> 5. Placement Anxiety & Wellness
          </div>
          <p className="text-xs text-gray-300">Pre-interview 2-min haptic breathing, rejection resilience, and peer wall support.</p>
        </div>
      </div>
    </div>
  );
}

export default FinalYearDrivePipelineScreen;
