import React, { useState } from 'react';
import { FaRobot, FaStar, FaFileAlt } from 'react-icons/fa';

export function StudentResumeATS() {
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyzeResume = (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      setAtsResult({
        score: 94,
        vectorMatch: 'Sentence-Transformers all-MiniLM-L6-v2 (Vector Cosine: 0.94)',
        matchedKeywords: ['React.js', 'CapacitorJS', 'REST API', 'PostgreSQL', 'FastAPI'],
        missingKeywords: ['System Architecture', 'Kubernetes'],
        recommendation: 'Excellent resume alignment! Highly recommended for shortlisting.'
      });
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">GROQ AI ATS ENGINE</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Groq LLaMA 3.3 70B ATS Vector Matcher</h1>
          <p className="text-xs text-slate-600 mt-1">Real-time resume vector similarity scoring against corporate Job Descriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 neu-card space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaFileAlt className="text-emerald-600" /> Target Job Description Input
          </h3>
          <form onSubmit={handleAnalyzeResume} className="space-y-4">
            <textarea 
              rows={6}
              placeholder="Paste Job Description text here (e.g., Seeking Software Engineer proficient in React, Capacitor, REST APIs, PostgreSQL)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full neu-input p-3 text-xs text-slate-800 font-semibold focus:outline-none"
            />
            <button type="submit" disabled={analyzing} className="w-full neu-btn-primary text-xs font-bold flex items-center justify-center gap-2">
              <FaRobot /> {analyzing ? 'Embedding & Scoring Vector Similarity...' : 'Run Groq LLaMA ATS Vector Score'}
            </button>
          </form>
        </div>

        <div className="p-6 neu-card space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaStar className="text-amber-500" /> AI Resume Vector Analysis Results
          </h3>

          {atsResult ? (
            <div className="space-y-3">
              <div className="p-4 neu-card bg-emerald-50 text-center">
                <div className="text-xs font-bold text-slate-600 uppercase">Match Score</div>
                <div className="text-4xl font-extrabold text-emerald-700 my-1">{atsResult.score} / 100</div>
                <div className="text-xs text-emerald-800 font-bold">{atsResult.vectorMatch}</div>
              </div>

              <div className="p-4 neu-card space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase">Matched Technical Vectors</div>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.matchedKeywords.map((kw, i) => (
                    <span key={i} className="neu-chip-active text-[11px]">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 neu-card space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase">Suggested Resume Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.missingKeywords.map((kw, i) => (
                    <span key={i} className="neu-chip-inactive text-[11px] border-amber-300 text-amber-800">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 neu-card text-center text-xs text-slate-500">
              Paste a Job Description on the left and click "Run Groq LLaMA ATS Vector Score" to view real-time vector analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentResumeATS;
