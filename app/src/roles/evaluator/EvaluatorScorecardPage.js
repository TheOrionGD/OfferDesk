import React from 'react';
import EvaluatorRubricScorecard from './EvaluatorRubricScorecard';

export function EvaluatorScorecardPage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 3 OF 10 • INTERACTIVE ASSESSMENT RUBRIC</span>
        <span className="text-xs text-slate-500 font-bold">Technical & Soft Skills Rating Scorecard</span>
      </div>
      <EvaluatorRubricScorecard />
    </div>
  );
}

export default EvaluatorScorecardPage;
