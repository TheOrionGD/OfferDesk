import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export function DeptCoordinatorProjectCreditsPage() {
  const { currentTenant } = useTenant();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProject, setNewProject] = useState({ title: '', student: '', guide: 'Faculty Guide' });
  const [showModal, setShowModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchProjects = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/dept/students?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.students) {
        const mapped = res.data.students.map((s, idx) => ({
          id: s._id || s.id || idx,
          title: `Engineering Capstone Project ${idx + 1}`,
          student: s.name || '',
          guide: 'Dr. Faculty Guide',
          verified: s.verifiedByDept || false
        }));
        setProjects(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch department projects:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toggleVerify = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, verified: !p.verified } : p));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.student) return;
    setProjects(prev => [{ id: Date.now().toString(), ...newProject, verified: true }, ...prev]);
    setNewProject({ title: '', student: '', guide: 'Faculty Guide' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 6 OF 10 • FINAL YEAR PROJECT CREDITS</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Cap Project Credits & Industry Sponsorship Log</h1>
            <p className="text-xs text-slate-500">Verify final year engineering project credits for {currentTenant?.name || ''}</p>
          </div>

          <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Log Project Credit
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading student project credits...</div>
        ) : projects.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold neu-card">
            No capstone project credits submitted yet.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="p-5 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{p.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Student: <strong>{p.student}</strong> • Guide: {p.guide}</p>
                </div>

                <button 
                  onClick={() => toggleVerify(p.id)}
                  className="neu-btn-primary text-xs font-bold"
                >
                  {p.verified ? 'Credits Verified' : 'Approve Project Credits'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Log Student Capstone Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Project Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. AI ATS Vector Resume Matching System"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Student Candidate Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Godfrey C D"
                  value={newProject.student}
                  onChange={(e) => setNewProject({ ...newProject, student: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Faculty Guide</label>
                <input 
                  type="text" required
                  placeholder="e.g. Dr. Alan Turing"
                  value={newProject.guide}
                  onChange={(e) => setNewProject({ ...newProject, guide: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Approve Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeptCoordinatorProjectCreditsPage;
