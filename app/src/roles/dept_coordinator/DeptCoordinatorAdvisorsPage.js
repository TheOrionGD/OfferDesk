import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export function DeptCoordinatorAdvisorsPage() {
  const { currentTenant } = useTenant();
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAdvisor, setNewAdvisor] = useState({ name: '', batch: '2023-2027 Section A' });
  const [showModal, setShowModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchAdvisors = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.users) {
        const facultyUsers = res.data.users
          .filter(u => u.role === 'dept_coordinator' || u.role === 'evaluator')
          .map((u, idx) => ({
            id: u._id || u.id || idx,
            name: u.name || '',
            batch: `2022-2026 Section ${String.fromCharCode(65 + idx)}`,
            studentsCount: 60
          }));
        setAdvisors(facultyUsers);
      }
    } catch (e) {
      console.error("Failed to fetch faculty advisors:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchAdvisors();
  }, [fetchAdvisors]);

  const handleAddAdvisor = (e) => {
    e.preventDefault();
    if (!newAdvisor.name) return;
    setAdvisors(prev => [{ id: Date.now().toString(), ...newAdvisor, studentsCount: 60 }, ...prev]);
    setNewAdvisor({ name: '', batch: '2023-2027 Section A' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 8 OF 10 • FACULTY ADVISOR ASSIGNMENTS</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Faculty Mentor & Class Advisor Allocation</h1>
            <p className="text-xs text-slate-500">Assign faculty advisors to student batches for {currentTenant?.name || ''}</p>
          </div>

          <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Assign Faculty Advisor
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading faculty class advisors...</div>
        ) : advisors.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold neu-card">
            No faculty class advisors allocated yet. Click the button above to assign a class advisor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisors.map(a => (
              <div key={a.id} className="p-5 neu-card space-y-2">
                <span className="neu-chip-active text-[10px] py-0.5 px-2">{a.batch}</span>
                <h4 className="text-sm font-bold text-slate-800">{a.name}</h4>
                <p className="text-xs text-slate-600">Mentored Candidates: <strong>{a.studentsCount} Students</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Assign Faculty Class Advisor</h3>
            <form onSubmit={handleAddAdvisor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Faculty Advisor Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Dr. John von Neumann"
                  value={newAdvisor.name}
                  onChange={(e) => setNewAdvisor({ ...newAdvisor, name: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Student Batch / Section</label>
                <input 
                  type="text" required
                  placeholder="e.g. 2023-2027 Section A"
                  value={newAdvisor.batch}
                  onChange={(e) => setNewAdvisor({ ...newAdvisor, batch: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Assign Advisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeptCoordinatorAdvisorsPage;
