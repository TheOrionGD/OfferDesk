import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaPlus, FaUpload } from "react-icons/fa";

export function TenantAdminRecruitersPage({ usersList = [], onPreRegisterUser, onDeleteUser }) {
  const { currentTenant } = useTenant();
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', role: 'recruiter', department: 'Corporate Relations', gpa: 8.0, company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onPreRegisterUser) onPreRegisterUser(form);
    setShowModal(false);
    setForm({ name: '', email: '', role: 'recruiter', department: 'Corporate Relations', gpa: 8.0, company: '' });
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) return;
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        if (values.length < headers.length) continue;
        
        const userObj = {};
        headers.forEach((header, idx) => {
          userObj[header] = values[idx];
        });
        
        if (onPreRegisterUser) {
          await onPreRegisterUser({
            name: userObj.name || userObj.email.split('@')[0],
            email: userObj.email,
            role: userObj.role || '',
            department: userObj.department || '',
            gpa: userObj.gpa || 8.0,
            backlogs: userObj.backlogs || 0,
            skills: userObj.skills || '',
            company: userObj.company || '',
            academicYear: userObj.academicYear || 4,
            joiningYear: userObj.joiningYear || 2023,
            placementIntent: userObj.placementIntent || '',
            customBatchTag: userObj.customBatchTag || ''
          });
          count++;
        }
      }
      alert(`✅ Bulk import completed! Pre-registered ${count} users successfully.`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 4 OF 10 • USER DIRECTORY & PRE-REGISTRATION</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Pre-Registered Enterprise User Accounts</h1>
            <p className="text-xs text-slate-500">Manage recruiters, HODs, evaluators, and student accounts for {currentTenant?.name}</p>
          </div>

          <div className="flex gap-2">
            <label className="neu-btn-secondary text-xs font-bold flex items-center gap-2 cursor-pointer">
              <FaUpload /> Bulk Import Student CSV
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleCsvUpload} 
                className="hidden" 
              />
            </label>

            <button onClick={() => setShowModal(true)} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
              <FaPlus /> Pre-Register User Account
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="neu-card bg-slate-100 text-slate-800 uppercase text-xs">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Official Email</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-semibold">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">No pre-registered accounts found for {currentTenant?.name}.</td>
                </tr>
              ) : (
                usersList.map(u => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-800">{u.name}</td>
                    <td className="p-3 font-mono text-emerald-700">{u.email}</td>
                    <td className="p-3">
                      <span className="neu-chip-active text-[10px] py-0.5 px-2">{u.role?.toUpperCase()}</span>
                    </td>
                    <td className="p-3">{u.department || ''}</td>
                    <td className="p-3">
                      <button onClick={() => onDeleteUser(u._id || u.id)} className="neu-btn-secondary text-[11px] text-rose-700 font-bold p-1 px-3">
                        Delete Account
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Pre-Register Enterprise User Account</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Dr. Alan Turing"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Official Institutional Email</label>
                <input 
                  type="email" required
                  placeholder="recruiter@university.ac.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Role</label>
                  <select 
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  >
                    <option value="student">Student Candidate</option>
                    <option value="dept_coordinator">Department HOD</option>
                    <option value="evaluator">Interview Evaluator</option>
                    <option value="recruiter">Recruiter Partner</option>
                    <option value="mentor">Mentor</option>
                    <option value="auditor">Compliance Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Department</label>
                  <input 
                    type="text" required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Confirm Pre-Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TenantAdminRecruitersPage;
