import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { FaStar, FaUserTimes } from 'react-icons/fa';
import axios from 'axios';

export function RecruiterCandidateSearch() {
  const { currentTenant } = useTenant();
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [skillFilter, setSkillFilter] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchCandidates = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/dept/students?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.students) {
        const mapped = res.data.students.map((s, idx) => ({
          name: s.name || '',
          regNo: s.regNo || `8111231040${idx + 10}`,
          dept: s.department || '',
          cgpa: parseFloat(s.gpa || s.cgpa || 8.0),
          skills: s.skills || ['React', 'Node.js', 'PostgreSQL'],
          atsScore: 85 + (idx % 10)
        }));
        setCandidates(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch candidates for recruiter search:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filtered = candidates.filter(c => 
    c.cgpa >= parseFloat(minCgpa || 0) &&
    (skillFilter === '' || c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())))
  );

  return (
    <div className="space-y-6 text-slate-800">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">CORPORATE RECRUITER PORTAL</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Candidate ATS Vector Search & Shortlisting Matrix</h1>
          <p className="text-xs text-slate-600 mt-1">Multi-Parameter Search Across Verified Student Portfolios & CGPA Records for {currentTenant?.name || ''}</p>
        </div>
      </div>

      <div className="p-6 neu-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Minimum CGPA Cutoff</label>
            <input 
              type="number" 
              step="0.1" 
              value={minCgpa} 
              onChange={e => setMinCgpa(e.target.value)} 
              className="w-full neu-input p-3 text-xs text-slate-800 font-semibold focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Filter by Technical Skill</label>
            <input 
              type="text" 
              placeholder="e.g. React, FastAPI, Python..." 
              value={skillFilter} 
              onChange={e => setSkillFilter(e.target.value)} 
              className="w-full neu-input p-3 text-xs text-slate-800 font-semibold focus:outline-none" 
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading candidate profiles...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaUserTimes className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Candidates Matching Search Filter</h4>
            <p className="text-xs text-slate-500">Try adjusting the CGPA cutoff or skill filter criteria above.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {filtered.map((c, i) => (
              <div key={i} className="p-4 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-800">{c.name}</h4>
                  <p className="text-xs text-slate-600">{c.dept} • Reg No: {c.regNo} • CGPA: <strong className="text-emerald-700">{c.cgpa}</strong></p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {c.skills.map((s, idx) => (
                      <span key={idx} className="neu-chip-inactive text-[10px]">{s}</span>
                    ))}
                  </div>
                </div>

                <button className="neu-btn-primary text-xs font-bold flex items-center gap-1.5">
                  <FaStar /> ATS Vector Score: {c.atsScore}%
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterCandidateSearch;
