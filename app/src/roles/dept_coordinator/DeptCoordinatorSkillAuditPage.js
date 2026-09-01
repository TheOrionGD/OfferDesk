import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export function DeptCoordinatorSkillAuditPage() {
  const { currentTenant } = useTenant();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSkill, setNewSkill] = useState({ name: '', elective: 'CS301', requiredLevel: 'Advanced', proficiency: '85%' });
  const [showModal, setShowModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchSkills = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/dept/students?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.students) {
        // Derive unique skills from students
        const allSkillsMap = {};
        res.data.students.forEach(st => {
          (st.skills || []).forEach(sk => {
            allSkillsMap[sk] = (allSkillsMap[sk] || 0) + 1;
          });
        });
        const derived = Object.keys(allSkillsMap).map((sk, idx) => ({
          name: sk,
          proficiency: `${Math.min(95, 75 + allSkillsMap[sk] * 5)}%`,
          requiredLevel: idx % 2 === 0 ? 'Advanced' : 'Intermediate',
          elective: `CS30${(idx % 5) + 1}`
        }));
        setSkills(derived);
      }
    } catch (e) {
      console.error("Failed to fetch department skills:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    setSkills(prev => [newSkill, ...prev]);
    setNewSkill({ name: '', elective: 'CS301', requiredLevel: 'Advanced', proficiency: '85%' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 5 OF 10 • DEPARTMENT SKILL GAP AUDIT</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Department Skill Gap Matrix & Elective Tracker</h1>
            <p className="text-xs text-slate-500">Track student proficiency in core technology stacks for {currentTenant?.name || ''}</p>
          </div>

          <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Add Department Elective Skill
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading department skill gap matrix...</div>
        ) : skills.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold neu-card">
            No department skills logged yet. Use the button above to add an elective skill stack.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.map((s, i) => (
              <div key={i} className="p-5 neu-card space-y-2">
                <span className="neu-chip-active text-[10px] py-0.5 px-2">{s.elective}</span>
                <h4 className="text-sm font-bold text-slate-800">{s.name}</h4>
                <p className="text-xs text-slate-600">Required Level: <strong>{s.requiredLevel}</strong></p>
                <div className="text-xs font-bold text-emerald-700">Batch Proficiency: {s.proficiency}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Add Department Elective Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Technology Skill Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Distributed Caching & Redis"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Elective Code</label>
                  <input 
                    type="text" required
                    placeholder="e.g. CS305"
                    value={newSkill.elective}
                    onChange={(e) => setNewSkill({ ...newSkill, elective: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Target Proficiency</label>
                  <input 
                    type="text" required
                    placeholder="e.g. 90%"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeptCoordinatorSkillAuditPage;
