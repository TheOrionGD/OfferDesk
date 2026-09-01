import React from "react";

export function EvaluatorBriefingPage({ selectedCandidate }) {
  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 4 OF 10 • CANDIDATE RESUME BRIEFING</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Candidate Background & Prior Round Briefing</h1>
        <p className="text-xs text-slate-500">Summary notes and ATS vector match for interview panelist</p>

        {selectedCandidate ? (
          <div className="space-y-4">
            <div className="p-5 neu-card bg-emerald-50/60">
              <h3 className="text-base font-bold text-slate-800">{selectedCandidate.name}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Round: <strong>{selectedCandidate.round}</strong> • Scheduled Time: {selectedCandidate.time}</p>
            </div>

            <div className="p-5 neu-card space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-700">Pre-Screening ATS Resume Summary</h4>
              <p className="text-xs text-slate-600">
                Strong background in Full Stack Web Development, CapacitorJS, React, Node.js, and MongoDB. CGPA: 8.94 / 10.0. No active backlogs.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 neu-card text-center text-xs text-slate-500">
            Select a candidate from the Live Queue tab to view candidate briefing notes.
          </div>
        )}
      </div>
    </div>
  );
}

export default EvaluatorBriefingPage;
