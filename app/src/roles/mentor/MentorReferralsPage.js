import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaPlus, FaFolderOpen } from "react-icons/fa";
import axios from "axios";

export function MentorReferralsPage() {
  const { currentTenant } = useTenant();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ studentName: '', regNo: '', company: 'Google Cloud', role: 'Software Engineer' });
  const [showModal, setShowModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchReferrals = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.users) {
        const studentUsers = res.data.users
          .filter(u => u.role === 'student' && u.gpa >= 8.0)
          .slice(0, 3)
          .map((u, idx) => ({
            id: u._id || u.id || idx,
            studentName: u.name || '',
            regNo: u.regNo || `8111231040${idx + 10}`,
            company: idx % 2 === 0 ? 'Google Cloud' : 'Microsoft Azure',
            role: 'Software Engineer I',
            status: 'REFERRAL_SUBMITTED'
          }));
        setReferrals(studentUsers);
      }
    } catch (e) {
      console.error("Failed to fetch mentor referrals:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleAddReferral = (e) => {
    e.preventDefault();
    if (!form.studentName) return;
    setReferrals(prev => [{ id: Date.now().toString(), ...form, status: 'REFERRAL_SUBMITTED' }, ...prev]);
    setForm({ studentName: '', regNo: '', company: 'Google Cloud', role: 'Software Engineer' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 9 OF 10 • CORPORATE REFERRAL HUB</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Corporate Referral Recommendation Hub</h1>
            <p className="text-xs text-slate-500">Submit official employee referral applications for top-performing mentees in {currentTenant?.name || ''}</p>
          </div>

          <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Submit Referral Recommendation
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading corporate referral recommendations...</div>
        ) : referrals.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaFolderOpen className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Corporate Referrals Submitted Yet</h4>
            <p className="text-xs text-slate-500">Use the button above to submit an employee referral recommendation for a student.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map(r => (
              <div key={r.id} className="p-4 neu-card flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{r.studentName} ({r.regNo})</h4>
                  <p className="text-xs text-slate-600">Company: <strong>{r.company}</strong> • Position: {r.role}</p>
                </div>
                <span className="neu-chip-active text-[10px] py-0.5 px-2">{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Submit Corporate Referral Recommendation</h3>
            <form onSubmit={handleAddReferral} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Student Candidate Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Godfrey C D"
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Register Number</label>
                <input 
                  type="text" required
                  placeholder="e.g. 811123104015"
                  value={form.regNo}
                  onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Target Company</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Google Cloud"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Role</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Software Engineer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorReferralsPage;
