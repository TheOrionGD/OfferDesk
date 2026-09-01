import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaClock } from "react-icons/fa";

export function EvaluatorLiveQueuePage({ candidates = [], selectedCandidate, onSelectCandidate }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 2 OF 10 • LIVE CANDIDATE QUEUE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Live Technical Interview Queue</h1>
        <p className="text-xs text-slate-500">Scheduled candidates for {currentTenant?.name}</p>

        <div className="space-y-3">
          {candidates.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              No candidates currently queued for evaluation in {currentTenant?.name}.
            </div>
          ) : (
            candidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => onSelectCandidate(c)}
                className={`p-4 neu-card cursor-pointer flex justify-between items-center flex-wrap gap-4 ${
                  selectedCandidate?.id === c.id ? 'border-2 border-emerald-500 bg-emerald-50/50' : ''
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{c.round} • Registered ID: {c.id}</p>
                </div>
                <span className="neu-chip-active text-xs flex items-center gap-1 font-mono">
                  <FaClock /> {c.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EvaluatorLiveQueuePage;
