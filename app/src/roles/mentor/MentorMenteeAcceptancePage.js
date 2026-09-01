import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { FaSearch, FaShieldAlt } from 'react-icons/fa';

export function MentorMenteeAcceptancePage({ mentees = [] }) {
  const { currentTenant } = useTenant();

  const [filterYear, setFilterYear] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const activeRecords = mentees.length > 0 ? mentees.map(m => ({
    studentId: m._id || m.id,
    name: m.name || m.menteeName || 'Mentee Candidate',
    regNo: m.regNo || m.registerNo || 'N/A',
    dept: m.dept || m.branch || 'CSE',
    section: m.section || 'A',
    year: m.year || '4th Year',
    company: m.company || 'Tech Corp',
    jobTitle: m.jobTitle || 'Software Engineer',
    status: m.acceptanceStatus || 'PENDING',
    rejectionReason: m.rejectionReason || ''
  })) : [];

  // Multi-Filter logic
  const filteredData = activeRecords.filter(r => {
    const matchesYear = filterYear === 'ALL' || r.year === filterYear;
    const matchesDept = filterDept === 'ALL' || r.dept === filterDept;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        
        {/* Title Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">MENTOR PORTAL • MENTEE OFFER ACCEPTANCE VIEW</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">
              Mentee Offer Acceptance & Counseling Tracker (Read-Only)
            </h1>
            <p className="text-xs text-slate-500">
              Mentor read-only view for tracking assigned mentees' offer responses and counseling reasons for {currentTenant?.name || ''}
            </p>
          </div>

          <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
            <FaShieldAlt className="inline mr-1" /> Mentor Read-Only Access
          </span>
        </div>

        {/* Multi-Filter Bar: Year, Dept, Status */}
        <div className="p-4 neu-card bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Search Input */}
            <div className="neu-input px-3 py-1.5 flex items-center gap-2 text-xs">
              <FaSearch className="text-slate-400" />
              <input
                type="text"
                placeholder="Search mentee or reg no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none w-36 sm:w-44"
              />
            </div>

            {/* Filter by Year */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span>Year:</span>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="neu-input px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Filter by Dept */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span>Dept:</span>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="neu-input px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Depts</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span>Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="neu-input px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="OVERDUE">OVERDUE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

          </div>

          <span className="text-xs font-bold text-purple-700 font-mono">
            Showing {filteredData.length} Mentees
          </span>
        </div>

        {/* Mentor Mentee Acceptance Table */}
        {filteredData.length === 0 ? (
          <div className="p-8 text-center neu-card text-xs text-slate-500 font-semibold space-y-1">
            <p>No mentee acceptance records matching the selected filters.</p>
            <p className="text-[11px] text-slate-400">Offer contracts issued to your assigned mentees will appear here in read-only mode.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-bold bg-slate-100">
                  <th className="p-3">Mentee Name</th>
                  <th className="p-3">Reg No</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Company Offer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Student Rejection Reason (For Counseling)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((row, idx) => (
                  <tr key={row.studentId || idx} className="hover:bg-slate-50 font-semibold text-slate-700">
                    <td className="p-3 font-bold text-slate-800">{row.name}</td>
                    <td className="p-3 font-mono">{row.regNo}</td>
                    <td className="p-3 font-bold text-purple-800">{row.dept}</td>
                    <td className="p-3 font-bold text-slate-700">{row.section}</td>
                    <td className="p-3">{row.year}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{row.company}</div>
                      <div className="text-[10px] text-slate-500">{row.jobTitle}</div>
                    </td>
                    <td className="p-3">
                      {row.status === 'ACCEPTED' && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                          ACCEPTED
                        </span>
                      )}
                      {row.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold border border-rose-300">
                          REJECTED
                        </span>
                      )}
                      {row.status === 'OVERDUE' && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
                          OVERDUE (48h)
                        </span>
                      )}
                      {row.status !== 'ACCEPTED' && row.status !== 'REJECTED' && row.status !== 'OVERDUE' && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-[10px] font-extrabold">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 italic">
                      {row.rejectionReason ? (
                        <span className="text-rose-700 font-semibold bg-rose-50 p-1.5 rounded border border-rose-200 block">
                          💬 {row.rejectionReason}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default MentorMenteeAcceptancePage;
