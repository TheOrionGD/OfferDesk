import React, { useState } from 'react';
import { FaClipboardCheck, FaCheckCircle } from 'react-icons/fa';

export function EvaluatorRubricScorecard() {
  const [techRating, setTechRating] = useState(4);
  const [sysDesignRating, setSysDesignRating] = useState(5);
  const [commRating, setCommRating] = useState(4);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitScorecard = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">INTERVIEW EVALUATOR PANEL</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Technical Interview Evaluation Scorecard</h1>
          <p className="text-xs text-slate-600 mt-1">Assess Candidate Technical Depth, System Architecture, & Communication Skills</p>
        </div>
      </div>

      <div className="p-6 neu-card space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FaClipboardCheck className="text-emerald-600" /> Candidate Technical Scorecard Evaluation
        </h3>

        {submitted && (
          <div className="p-4 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 text-lg" /> Candidate Evaluation Scorecard submitted to Placement Cell!
          </div>
        )}

        <form onSubmit={handleSubmitScorecard} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Data Structures & Technical Problem Solving (1-5)</label>
            <input type="range" min="1" max="5" value={techRating} onChange={e => setTechRating(e.target.value)} className="w-full" />
            <span className="text-xs font-bold text-emerald-700">Rating: {techRating} / 5</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">System Design & Architectural Thinking (1-5)</label>
            <input type="range" min="1" max="5" value={sysDesignRating} onChange={e => setSysDesignRating(e.target.value)} className="w-full" />
            <span className="text-xs font-bold text-emerald-700">Rating: {sysDesignRating} / 5</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Communication & Professional Articulation (1-5)</label>
            <input type="range" min="1" max="5" value={commRating} onChange={e => setCommRating(e.target.value)} className="w-full" />
            <span className="text-xs font-bold text-emerald-700">Rating: {commRating} / 5</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Panel Feedback & Recommendation</label>
            <textarea 
              rows={4} 
              value={comments} 
              onChange={e => setComments(e.target.value)}
              placeholder="Provide detailed feedback on candidate's technical strengths, coding speed, and areas for improvement..."
              className="w-full neu-input p-3 text-xs text-slate-800 font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold w-full py-3">
            Submit Evaluation & Recommendation
          </button>
        </form>
      </div>
    </div>
  );
}

export default EvaluatorRubricScorecard;
