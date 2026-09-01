import React from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaMobileAlt } from "react-icons/fa";

export function EvaluatorOverviewPage({ candidates = [], selectedCandidate }) {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">TECHNICAL INTERVIEW EVALUATOR</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Interview Assessment Control Center</h1>
          <p className="text-xs text-slate-600 mt-1">
            Panelist: <strong className="text-emerald-700">{user?.name || "Technical Panelist"}</strong> • Live Assessment for {currentTenant?.name}
          </p>
        </div>

        <span className="neu-chip-active text-xs flex items-center gap-1">
          <FaMobileAlt /> Mobile Suite
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Live Candidate Queue</div>
          <div className="text-3xl font-extrabold text-slate-800 my-1">{candidates.length}</div>
          <div className="text-[11px] text-emerald-700 font-bold">Candidates Waiting</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Current Selected Candidate</div>
          <div className="text-sm font-extrabold text-emerald-700 my-2 truncate">
            {selectedCandidate ? selectedCandidate.name : 'None Selected'}
          </div>
          <div className="text-[11px] text-slate-500 font-bold">{selectedCandidate ? selectedCandidate.round : 'Select Candidate in Queue'}</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Evaluations Completed Today</div>
          <div className="text-3xl font-extrabold text-blue-600 my-1">6</div>
          <div className="text-[11px] text-blue-700 font-bold">Scorecards Synced to DB</div>
        </div>
      </div>
    </div>
  );
}

export default EvaluatorOverviewPage;
