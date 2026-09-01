import React from 'react';
import AiAtsLeaderboard from './AiAtsLeaderboard';

export function RecruiterAtsMatcherPage({ jobs = [] }) {
  const activeJobSpec = jobs[0] || {
    title: 'Full Stack Software Engineer',
    company: 'Corporate Partner',
    minGpa: 7.0,
    requiredSkills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'REST API']
  };

  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 3 OF 10 • AI ATS VECTOR MATCHER</span>
        <span className="text-xs text-slate-500 font-bold">Groq LLaMA & Sentence Transformers NLP</span>
      </div>

      <AiAtsLeaderboard jobSpec={activeJobSpec} />
    </div>
  );
}

export default RecruiterAtsMatcherPage;
