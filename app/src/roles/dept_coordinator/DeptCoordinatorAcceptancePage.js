import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { FaFileDownload, FaCheckCircle, FaUserEdit, FaSearch } from 'react-icons/fa';

export function DeptCoordinatorAcceptancePage({ students = [] }) {
  const { currentTenant } = useTenant();

  // Multi-Filter State
  const [filterYear, setFilterYear] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState(null);

  // Initialize records from props or dynamic list
  const activeRecords = records.length > 0 ? records : (students.length > 0 ? students.map(s => ({
    studentId: s._id || s.id,
    name: s.name || 'Student Candidate',
    regNo: s.regNo || s.registerNo || 'N/A',
    dept: s.dept || s.department || 'CSE',
    section: s.section || 'A',
    year: s.year || '4th Year',
    company: s.company || 'Tech Corp',
    jobTitle: s.jobTitle || 'Software Engineer',
    status: s.acceptanceStatus || 'PENDING',
    rejectionReason: s.rejectionReason || ''
  })) : []);

  // Filter logic
  const filteredData = activeRecords.filter(r => {
    const matchesYear = filterYear === 'ALL' || r.year === filterYear;
    const matchesDept = filterDept === 'ALL' || r.dept === filterDept;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesDept && matchesStatus && matchesSearch;
  });

  // HOD Exclusive Write/Update Control: Override Overdue / Unaccepted Student as ACCEPTED
  const handleHodOverrideAccept = (studentId, studentName) => {
    setRecords(prev => {
      const source = prev.length > 0 ? prev : activeRecords;
      return source.map(r => r.studentId === studentId ? { ...r, status: 'ACCEPTED', rejectionReason: 'HOD Administrative Override' } : r);
    });
    setMsg(`✅ HOD Administrative Override: Marked offer as ACCEPTED for ${studentName}.`);
    setTimeout(() => setMsg(null), 4000);
  };

  // Download filtered data as CSV spreadsheet
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = ["Name", "Register No", "Department", "Section", "Academic Year", "Company Partner", "Job Title", "Acceptance Status", "Rejection Reason"];
    const rows = filteredData.map(r => [
      `"${r.name}"`,
      `"${r.regNo}"`,
      `"${r.dept}"`,
      `"${r.section}"`,
      `"${r.year}"`,
      `"${r.company}"`,
      `"${r.jobTitle}"`,
      `"${r.status}"`,
      `"${r.rejectionReason || 'N/A'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HOD_Student_Acceptance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        
        {/* Title Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">HOD CONSOLE • MASTER ACCEPTANCE MATRIX</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">
              Student Offer Acceptance Control & CSV Exporter
            </h1>
            <p className="text-xs text-slate-500">
              Department HOD master matrix for tracking student acceptances, rejections, and executing administrative overrides for {currentTenant?.name || ''}
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="neu-btn-primary text-xs font-bold px-4 py-2.5 flex items-center gap-2"
          >
            <FaFileDownload /> Export Acceptance Report as CSV
          </button>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 text-base" /> {msg}
          </div>
        )}

        {/* Multi-Filter Bar: Year, Dept, Status */}
        <div className="p-4 neu-card bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Search Input */}
            <div className="neu-input px-3 py-1.5 flex items-center gap-2 text-xs">
              <FaSearch className="text-slate-400" />
              <input
                type="text"
                placeholder="Search student or reg no..."
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

          <span className="text-xs font-bold text-indigo-700 font-mono">
            Showing {filteredData.length} of {activeRecords.length} Students
          </span>
        </div>

        {/* Master Acceptance Table */}
        {filteredData.length === 0 ? (
          <div className="p-8 text-center neu-card text-xs text-slate-500 font-semibold space-y-1">
            <p>No student acceptance records matching the selected filters.</p>
            <p className="text-[11px] text-slate-400">Offer contracts issued by Placement Officers through HOD Spaces will populate here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-bold bg-slate-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Reg No</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Company Offer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Rejection Reason / Notes</th>
                  <th className="p-3">HOD Exclusive Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((row, idx) => (
                  <tr key={row.studentId || idx} className="hover:bg-slate-50 font-semibold text-slate-700">
                    <td className="p-3 font-bold text-slate-800">{row.name}</td>
                    <td className="p-3 font-mono">{row.regNo}</td>
                    <td className="p-3 font-bold text-indigo-800">{row.dept}</td>
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
                      {row.rejectionReason || '—'}
                    </td>
                    <td className="p-3">
                      {row.status !== 'ACCEPTED' ? (
                        <button
                          onClick={() => handleHodOverrideAccept(row.studentId, row.name)}
                          className="neu-btn-primary text-[10px] font-extrabold py-1 px-2.5 flex items-center gap-1"
                          title="HOD Exclusive Write Permission: Change Status to ACCEPTED"
                        >
                          <FaUserEdit /> HOD Override as Accept
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-bold">✓ Verified</span>
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

export default DeptCoordinatorAcceptancePage;
