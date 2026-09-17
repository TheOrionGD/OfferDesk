import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUserCheck, FaList, FaStar, FaComments, FaQuestionCircle,
  FaEdit, FaCheckCircle, FaHistory, FaChartBar, FaCogs,
  FaExclamationTriangle, FaUniversity
} from 'react-icons/fa';
import axios from 'axios';

import EvaluatorOverviewPage from "./EvaluatorOverviewPage";
import EvaluatorLiveQueuePage from "./EvaluatorLiveQueuePage";
import EvaluatorScorecardPage from "./EvaluatorScorecardPage";
import EvaluatorBriefingPage from "./EvaluatorBriefingPage";
import EvaluatorQuestionBankPage from "./EvaluatorQuestionBankPage";
import EvaluatorScratchpadPage from "./EvaluatorScratchpadPage";
import EvaluatorDecisionPage from "./EvaluatorDecisionPage";
import EvaluatorHistoryPage from "./EvaluatorHistoryPage";
import EvaluatorAnalyticsPage from "./EvaluatorAnalyticsPage";
import EvaluatorSettingsPage from "./EvaluatorSettingsPage";

export function InterviewEvaluatorPanel() {
  const { currentTenant, backendError: tenantError } = useTenant();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('control');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchCandidates = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/api/evaluations/candidates?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.candidates) {
        setCandidates(res.data.candidates);
        setSelectedCandidate(res.data.candidates[0] || null);
      }
    } catch (e) {
      setErrorMsg('⚠️ Service Currently Unavailable: Unable to fetch live interview candidates. Backend REST API on port 5001 is offline.');
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const navItems = [
    { key: 'control',    title: '1. Control Center',      icon: <FaUserCheck /> },
    { key: 'queue',      title: '2. Live Queue',           icon: <FaList /> },
    { key: 'scorecard',  title: '3. Scorecard',            icon: <FaStar /> },
    { key: 'briefing',   title: '4. Candidate Briefing',   icon: <FaComments /> },
    { key: 'questions',  title: '5. Question Bank',        icon: <FaQuestionCircle /> },
    { key: 'scratchpad', title: '6. Scratchpad',           icon: <FaEdit /> },
    { key: 'decision',   title: '7. Verdict Decision',     icon: <FaCheckCircle /> },
    { key: 'history',    title: '8. Scorecard History',    icon: <FaHistory /> },
    { key: 'analytics',  title: '9. Panel Analytics',      icon: <FaChartBar /> },
    { key: 'settings',   title: '10. Evaluator Settings',  icon: <FaCogs /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Rose / Red) ───────────────────────────── */}
      <div className="role-banner role-banner--evaluator">
        <div className="role-banner-left">
          <span className="role-badge role-badge--evaluator">
            <FaUserCheck /> Interview Evaluator
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Evaluator'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9f1239' }}>
            {candidates.length} Candidates in Queue
          </span>
        </div>
      </div>

      {/* Service Alert Banner */}
      {(errorMsg || tenantError) && (
        <div className="p-4 neu-card bg-rose-50 border-rose-300 text-rose-800 font-semibold text-xs flex items-center gap-3">
          <FaExclamationTriangle className="text-rose-500 text-lg shrink-0" />
          <div>{errorMsg || tenantError}</div>
        </div>
      )}

      {/* 10 Sub-Page Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === item.key ? 'neu-chip-active--evaluator' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'control' && (
        <EvaluatorOverviewPage candidates={candidates} selectedCandidate={selectedCandidate} />
      )}
      {activeTab === 'queue' && (
        <EvaluatorLiveQueuePage 
          candidates={candidates}
          selectedCandidate={selectedCandidate}
          onSelectCandidate={(c) => setSelectedCandidate(c)}
        />
      )}
      {activeTab === 'scorecard' && <EvaluatorScorecardPage />}
      {activeTab === 'briefing' && <EvaluatorBriefingPage selectedCandidate={selectedCandidate} />}
      {activeTab === 'questions' && <EvaluatorQuestionBankPage />}
      {activeTab === 'scratchpad' && <EvaluatorScratchpadPage />}
      {activeTab === 'decision' && <EvaluatorDecisionPage selectedCandidate={selectedCandidate} />}
      {activeTab === 'history' && <EvaluatorHistoryPage />}
      {activeTab === 'analytics' && <EvaluatorAnalyticsPage />}
      {activeTab === 'settings' && <EvaluatorSettingsPage />}
    </div>
  );
}

export default InterviewEvaluatorPanel;
