import React from 'react';
import RecruiterCandidateSearch from './RecruiterCandidateSearch';

export function RecruiterCandidateSearchPage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 6 OF 10 • ADVANCED CANDIDATE SEARCH</span>
        <span className="text-xs text-slate-500 font-bold">CGPA & Skill Vector Search</span>
      </div>
      <RecruiterCandidateSearch />
    </div>
  );
}

export default RecruiterCandidateSearchPage;
