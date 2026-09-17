import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { scoreAndRankCandidates } from '../../services/aiAtsService';
import { FaRobot, FaSlidersH, FaTrophy, FaCheckCircle, FaUserCheck, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function AiAtsLeaderboard({ jobSpec, candidates = [] }) {
  const [weights, setWeights] = useState({
    skills_weight: 0.40,
    projects_weight: 0.30,
    gpa_weight: 0.20,
    certs_weight: 0.10
  });

  const [fetchedCandidates, setFetchedCandidates] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shortlisted, setShortlisted] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setFetchedCandidates(candidates);
    } else {
      axios.get(`${API_BASE_URL}/api/dept/students`)
        .then(res => {
          if (res.data && res.data.students) {
            setFetchedCandidates(res.data.students.map(s => ({
              id: s._id || s.id,
              name: s.name,
              email: s.email,
              skills: s.skills || [],
              gpa: s.gpa || s.cgpa || 0,
              projectSummary: s.projectSummary || s.experience || '',
              certifications: s.certifications || []
            })));
          }
        })
        .catch(err => {
          setErrorMsg('⚠️ Service Currently Unavailable: Unable to fetch candidate records from REST backend on port 5001.');
        });
    }
  }, [candidates]);

  const runAtsScoring = useCallback(async () => {
    if (!jobSpec) {
      setErrorMsg('⚠️ Drive Specification Required: Please select an active recruitment drive to rank candidate applicants.');
      setLeaderboard([]);
      return;
    }
    if (fetchedCandidates.length === 0) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await scoreAndRankCandidates(jobSpec, fetchedCandidates, weights);
      if (result && result.leaderboard) {
        setLeaderboard(result.leaderboard);
      }
    } catch (err) {
      setErrorMsg(err.message || '⚠️ Service Currently Unavailable: Python FastAPI AI microservice on port 8000 is unreachable.');
    } finally {
      setLoading(false);
    }
  }, [jobSpec, fetchedCandidates, weights]);

  useEffect(() => {
    runAtsScoring();
  }, [runAtsScoring]);

  const handleBulkShortlist = () => {
    const topCandidates = leaderboard.filter(c => c.total_match_score >= 70).map(c => c.candidate_id);
    setShortlisted(topCandidates);
  };

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-slate-900/90 text-white shadow-2xl space-y-6">
      {errorMsg && (
        <div className="p-4 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl font-semibold text-xs flex items-center gap-3 shadow-xl">
          <FaExclamationTriangle className="text-rose-400 text-lg shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-400">
            <FaRobot className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">AI NLP Candidate Matcher & ATS Engine</h3>
            <p className="text-xs text-gray-400">Sentence Transformers NLP Embeddings & Cosine Vector Scoring</p>
          </div>
        </div>

        <button 
          onClick={handleBulkShortlist}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg"
        >
          <FaCheckCircle /> One-Click Bulk Shortlist (≥ 70% Score)
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/60 border border-gray-700">
        <h4 className="text-xs font-bold uppercase text-emerald-400 mb-3 flex items-center gap-2">
          <FaSlidersH /> Corporate ATS Weight Rules Configuration
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Core Skills Weight</span>
              <span className="text-emerald-400 font-bold">{Math.round(weights.skills_weight * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={weights.skills_weight}
              onChange={(e) => setWeights({ ...weights, skills_weight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-700 rounded h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Project Exp Weight</span>
              <span className="text-cyan-400 font-bold">{Math.round(weights.projects_weight * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={weights.projects_weight}
              onChange={(e) => setWeights({ ...weights, projects_weight: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 bg-slate-700 rounded h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Academic GPA Weight</span>
              <span className="text-amber-400 font-bold">{Math.round(weights.gpa_weight * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={weights.gpa_weight}
              onChange={(e) => setWeights({ ...weights, gpa_weight: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-700 rounded h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Certifications Weight</span>
              <span className="text-purple-400 font-bold">{Math.round(weights.certs_weight * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={weights.certs_weight}
              onChange={(e) => setWeights({ ...weights, certs_weight: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 bg-slate-700 rounded h-1.5"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold uppercase text-gray-300 mb-4 flex items-center gap-2">
          <FaTrophy className="text-amber-400" /> Ranked Candidate Leaderboard
        </h4>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Computing Sentence-Transformers Vector Similarity...</div>
        ) : (
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl border border-gray-700">
                No candidate records found in MongoDB. Register students or connect to backend REST API.
              </div>
            ) : (
              leaderboard.map((item, index) => {
                const isShortlisted = shortlisted.includes(item.candidate_id);
                return (
                  <div 
                    key={item.candidate_id} 
                    className={`p-4 rounded-xl border transition-all flex justify-between items-center flex-wrap gap-4 ${index === 0 ? 'bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-800 border-emerald-500/60 shadow-lg' : 'bg-slate-800/60 border-gray-700 hover:border-gray-600'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-gray-300'}`}>
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-base">{item.candidate_name}</h5>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${item.recommendation === 'Strong Match' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'}`}>
                            {item.recommendation}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{item.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex gap-4 text-xs font-mono text-gray-300">
                        <div>Skills: <span className="text-emerald-400 font-bold">{item.breakdown.skills_score}%</span></div>
                        <div>GPA: <span className="text-amber-400 font-bold">{item.breakdown.gpa_score}%</span></div>
                        <div>Projects: <span className="text-cyan-400 font-bold">{item.breakdown.project_score}%</span></div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-400">{item.total_match_score}%</span>
                        <span className="block text-[10px] text-gray-400 uppercase font-semibold">Match Score</span>
                      </div>

                      <button 
                        onClick={() => {
                          if (isShortlisted) {
                            setShortlisted(shortlisted.filter(id => id !== item.candidate_id));
                          } else {
                            setShortlisted([...shortlisted, item.candidate_id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${isShortlisted ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-gray-200'}`}
                      >
                        {isShortlisted ? <span className="flex items-center gap-1"><FaUserCheck /> Shortlisted</span> : 'Shortlist'}
                      </button>
                    </div>
                  </div>
                );
              }))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AiAtsLeaderboard;
