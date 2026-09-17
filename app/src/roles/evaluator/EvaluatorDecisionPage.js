import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

export function EvaluatorDecisionPage({ selectedCandidate }) {
  const [decision, setDecision] = useState('RECOMMEND');
  const [submittedMsg, setSubmittedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMsg(true);
    setTimeout(() => setSubmittedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-xl">
        <span className="neu-chip-active">PAGE 7 OF 10 • FINAL RECOMMENDATION SUBMISSION</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Final Panelist Verdict & Decision</h1>
        <p className="text-xs text-slate-500">Submit final hiring recommendation for {selectedCandidate?.name || ''}</p>

        {submittedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Hiring decision submitted to Placement Officer & Recruiter!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-slate-600">Select Recommendation Verdict</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                type="button" 
                onClick={() => setDecision('RECOMMEND')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all ${decision === 'RECOMMEND' ? 'neu-chip-active' : 'neu-chip-inactive'}`}
              >
                RECOMMEND
              </button>
              <button 
                type="button" 
                onClick={() => setDecision('HOLD')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all ${decision === 'HOLD' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'neu-chip-inactive'}`}
              >
                HOLD
              </button>
              <button 
                type="button" 
                onClick={() => setDecision('REJECT')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all ${decision === 'REJECT' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'neu-chip-inactive'}`}
              >
                REJECT
              </button>
            </div>
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold w-full py-3">
            Submit Final Decision
          </button>
        </form>
      </div>
    </div>
  );
}

export default EvaluatorDecisionPage;
