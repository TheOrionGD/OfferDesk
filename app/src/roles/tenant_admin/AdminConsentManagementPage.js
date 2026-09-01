import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import {
  FaPlus, FaFileSignature, FaShieldAlt, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaSearch, FaUsers, FaUserGraduate, FaCalendarAlt, FaTrashAlt, FaPrint, FaRegListAlt,
  FaRupeeSign, FaBuilding, FaUserTie
} from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const PLACEMENT_OFFICER_SUBJECTS = [
  'PLACEMENT_POLICY_UNDERTAKING',
  'OUTSTATION_TRIP_INDEMNITY_WAIVER',
  'CUSTOM_NOTICE_UNDERTAKING'
];

const HOD_SUBJECTS = [
  'UGC_ANTI_RAGGING_UNDERTAKING',
  'ATTENDANCE_CONDONATION_UNDERTAKING',
  'GAP_YEAR_AFFIDAVIT_DECLARATION',
  'FEE_PAYMENT_INSTALLMENT_UNDERTAKING',
  'SCHOLARSHIP_DUPLICATE_INCOME_DECLARATION',
  'PROJECT_PLAGIARISM_DECLARATION',
  'MEDICAL_FITNESS_EMERGENCY_CONSENT'
];

const SUBJECT_TEMPLATES = {
  PLACEMENT_POLICY_UNDERTAKING: {
    title: 'Training & Placement Policy, Training Fee & "One Student One Job" Rule Undertaking',
    details: `1. I hereby undertake to strictly adhere to the Training & Placement Cell regulations.\n2. I understand that accepting a placement offer binds me to the company and precludes me from appearing in subsequent campus recruitment drives unless explicitly permitted under Tier-1 upgrade rules.\n3. Attendance in scheduled campus interview rounds and mandatory placement training is strictly required.`,
    expirationHours: 48,
    parentConsentRequired: false,
    trainingAmount: '15000'
  },
  UGC_ANTI_RAGGING_UNDERTAKING: {
    title: 'UGC Mandatory Anti-Ragging & Campus Code of Conduct Declaration',
    details: `I solemnly declare that I shall not engage in, abet, or propagate any act of ragging within or outside the university premises. I am fully aware of the UGC Anti-Ragging Guidelines and legal consequences including expulsion and FIR registration.`,
    expirationHours: 72,
    parentConsentRequired: true
  },
  ATTENDANCE_CONDONATION_UNDERTAKING: {
    title: 'End-Semester Exam Hall Ticket Attendance Makeup Undertaking',
    details: `This undertaking is issued for condonation of attendance shortage below the mandatory 75% threshold. I promise to attend all remedial classes and complete extra assignments prior to end-semester examinations.`,
    expirationHours: 24,
    parentConsentRequired: true
  },
  GAP_YEAR_AFFIDAVIT_DECLARATION: {
    title: 'Gap Year / Study Break Affidavit & Clean Conduct Self-Declaration',
    details: `I hereby declare that the gap in my academic study between 12th/Graduation and current course admission was solely for private preparation. I certify that I was not involved in any criminal proceedings or anti-social activities during this break.`,
    expirationHours: 168,
    parentConsentRequired: false
  },
  FEE_PAYMENT_INSTALLMENT_UNDERTAKING: {
    title: 'Semester Fee Dues Clearance & Payment Schedule Undertaking',
    details: `I undertake to clear my pending tuition and hostel fee dues as per the approved installment plan. I agree that non-clearance by the stipulated deadline will result in withholding of semester marksheet and exam registration.`,
    expirationHours: 48,
    parentConsentRequired: true
  },
  SCHOLARSHIP_DUPLICATE_INCOME_DECLARATION: {
    title: 'Government Scholarship Income Ceiling & Non-Duplicate Undertaking',
    details: `I declare that my total family annual income does not exceed the ceiling prescribed under the government scholarship scheme. I certify that I am not receiving any duplicate fee concession or scholarship from any other public or private source.`,
    expirationHours: 72,
    parentConsentRequired: true
  },
  OUTSTATION_TRIP_INDEMNITY_WAIVER: {
    title: 'Field Visit, Industrial Tour & Outstation Trip Risk Indemnity Waiver',
    details: `I give my full consent to participate in the official industrial tour/field trip. I agree to abide by faculty instructions and undertake that the institution will not be held liable for any personal accidents resulting from unauthorized individual movement.`,
    expirationHours: 48,
    parentConsentRequired: true
  },
  PROJECT_PLAGIARISM_DECLARATION: {
    title: 'B.Tech/M.Tech Project Thesis Originality & Anti-Plagiarism Certificate',
    details: `I certify that the thesis/project report submitted by me is my original work. All references and citations have been duly acknowledged, and the overall similarity index is within the university prescribed limit (below 15%).`,
    expirationHours: 48,
    parentConsentRequired: false
  },
  MEDICAL_FITNESS_EMERGENCY_CONSENT: {
    title: 'Student Medical Fitness & Emergency Medical Treatment Consent',
    details: `I authorize the university medical officer and hospital staff to administer emergency medical aid, diagnostic tests, and hospitalization if required during my stay on campus or during university activities.`,
    expirationHours: 168,
    parentConsentRequired: true
  },
  CUSTOM_NOTICE_UNDERTAKING: {
    title: 'Institutional Special Notice & Student Compliance Undertaking',
    details: `Custom legal compliance notice and undertaking details issued by university authority.`,
    expirationHours: 48,
    parentConsentRequired: false
  }
};

export default function AdminConsentManagementPage() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const isHod = user?.role === 'dept_coordinator';
  const issuerRoleTitle = isHod ? 'Department HOD (Academic Authority)' : 'Campus Placement Officer (T&P Authority)';

  const [students, setStudents] = useState([]);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [msg, setMsg] = useState(null);

  // Form State
  const defaultSub = isHod ? 'ATTENDANCE_CONDONATION_UNDERTAKING' : 'PLACEMENT_POLICY_UNDERTAKING';
  const [targetStudentId, setTargetStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(defaultSub);
  const [title, setTitle] = useState(SUBJECT_TEMPLATES[defaultSub].title);
  const [details, setDetails] = useState(SUBJECT_TEMPLATES[defaultSub].details);
  const [trainingAmount, setTrainingAmount] = useState(SUBJECT_TEMPLATES[defaultSub].trainingAmount || '');
  const [expirationHours, setExpirationHours] = useState(48);
  const [parentConsentRequired, setParentConsentRequired] = useState(false);
  const [allowManualPrintout, setAllowManualPrintout] = useState(true);

  const [filterSubject, setFilterSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-populate template when subject changes
  const handleSubjectChange = (subjectKey) => {
    setSelectedSubject(subjectKey);
    const tmpl = SUBJECT_TEMPLATES[subjectKey] || SUBJECT_TEMPLATES.CUSTOM_NOTICE_UNDERTAKING;
    setTitle(tmpl.title);
    setDetails(tmpl.details);
    setTrainingAmount(tmpl.trainingAmount || '');
    setExpirationHours(tmpl.expirationHours);
    setParentConsentRequired(tmpl.parentConsentRequired);
  };

  const fetchData = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const [stuRes, conRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users?tenantId=${currentTenant.tenantId}&role=student`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'x-tenant-id': currentTenant.tenantId
          }
        }),
        fetch(`${API_BASE_URL}/api/student-consents?tenantId=${currentTenant.tenantId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'x-tenant-id': currentTenant.tenantId
          }
        })
      ]);

      const stuData = await stuRes.json();
      const conData = await conRes.json();

      if (stuData.success) setStudents(stuData.users || stuData.students || []);
      if (conData.success) setConsents(conData.consents || []);
    } catch (err) {
      console.error("Admin Consent fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleIssueConsentNotice = async (e) => {
    e.preventDefault();
    if (!targetStudentId) {
      setMsg({ type: 'error', text: '⚠️ Please select a target student.' });
      return;
    }
    if (!title.trim() || !details.trim()) {
      setMsg({ type: 'error', text: '⚠️ Title and Undertaking Details cannot be empty.' });
      return;
    }

    setIssuing(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/student-consents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-tenant-id': currentTenant?.tenantId
        },
        body: JSON.stringify({
          studentId: targetStudentId,
          subject: selectedSubject,
          title,
          details,
          trainingAmount,
          issuedBy: isHod ? `Department HOD Office (${user?.name || 'HOD'})` : `Campus Placement Officer (${user?.name || 'T&P Office'})`,
          expirationHours,
          parentConsentRequired,
          allowManualPrintout
        })
      });
      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: `🎉 Student Consent Undertaking Notice created & issued to student!` });
        fetchData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to issue notice.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setIssuing(false);
    }
  };

  const handleRevokeConsent = async (consentId) => {
    if (!window.confirm('Are you sure you want to revoke this consent undertaking?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/student-consents/${consentId}/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'x-tenant-id': currentTenant?.tenantId
        }
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Consent undertaking notice revoked.' });
        fetchData();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const filteredConsents = consents.filter(c => {
    if (filterSubject !== 'ALL' && c.subject !== filterSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.studentName?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-2xl neu-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-2xl">
            <FaUserTie />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Student E-Consent Governance</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {issuerRoleTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Issue and audit binding legal student undertakings. Placement Officers issue placement training & drive fees, while Department HODs issue academic & attendance condonation notices.
            </p>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl font-medium text-xs flex items-center gap-3 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/40 text-rose-300'
        }`}>
          {msg.type === 'success' ? <FaCheckCircle className="text-lg text-emerald-400 shrink-0" /> : <FaExclamationTriangle className="text-lg text-rose-400 shrink-0" />}
          <div>{msg.text}</div>
        </div>
      )}

      {/* Grid: Creation Form + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-1 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FaPlus className="text-emerald-400" /> Create Consent Notice (Issuer: {isHod ? 'HOD' : 'Placement Officer'})
          </h2>

          <form onSubmit={handleIssueConsentNotice} className="space-y-3 text-xs">
            
            {/* Student Selector */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target End Person (Student) *</label>
              <select
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              >
                <option value="">-- Select Student Candidate --</option>
                {students.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.name} ({s.email || s.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Domain */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Subject Domain *</label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-bold text-emerald-400"
              >
                <optgroup label="💼 Placement Officer Subjects (T&P Cell)">
                  {PLACEMENT_OFFICER_SUBJECTS.map(k => (
                    <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>
                  ))}
                </optgroup>
                <optgroup label="🎓 Department HOD Subjects (Academic Office)">
                  {HOD_SUBJECTS.map(k => (
                    <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Training Amount (for Placement Officer) */}
            {!isHod && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <FaRupeeSign className="text-amber-400" /> Placement Training & Assessment Amount (₹)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15000 (Training & Skill Assessment Charge)"
                  value={trainingAmount}
                  onChange={(e) => setTrainingAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Notice Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Undertaking Details */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Undertaking Clauses & Terms *</label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            {/* Expiration Hours */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Expiration Timer (Hours) *</label>
              <select
                value={expirationHours}
                onChange={(e) => setExpirationHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={24}>24 Hours (Urgent)</option>
                <option value={48}>48 Hours (Standard)</option>
                <option value={72}>72 Hours (3 Days)</option>
                <option value={168}>168 Hours (7 Days / 1 Week)</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={parentConsentRequired}
                  onChange={(e) => setParentConsentRequired(e.target.checked)}
                  className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>Require Parent / Guardian Dual Signature</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={allowManualPrintout}
                  onChange={(e) => setAllowManualPrintout(e.target.checked)}
                  className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>Allow Manual Paper Printout Export</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={issuing}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <FaFileSignature />
              <span>{issuing ? 'Issuing Notice...' : `Issue Student Consent Notice (${isHod ? 'HOD' : 'Placement Officer'})`}</span>
            </button>
          </form>
        </div>

        {/* Audit Table Column */}
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FaRegListAlt className="text-emerald-400" /> Issued Consent Undertakings Audit Log ({consents.length})
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <FaSearch className="absolute left-2.5 top-2 text-slate-500 text-xs" />
                <input
                  type="text"
                  placeholder="Filter student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading consent records...</div>
          ) : filteredConsents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No consent undertakings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">End Person (Student)</th>
                    <th className="py-2.5 px-3">Authority / Subject</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Deadline</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredConsents.map((c) => {
                    const isGranted = c.status === 'CONSENT_GRANTED';
                    const isExpired = c.status === 'EXPIRED_OVERDUE';
                    const isRevoked = c.status === 'REVOKED';
                    const isPlacementOfficer = c.issuerAuthority === 'CAMPUS_PLACEMENT_OFFICER' || c.issuedByRole === 'tenant_admin';

                    return (
                      <tr key={c.consentId} className="hover:bg-slate-850 transition-all">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <FaUserGraduate className="text-emerald-400 text-xs" />
                            {c.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">{c.studentEmail || c.studentId}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                              isPlacementOfficer 
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            }`}>
                              {isPlacementOfficer ? '🏛️ Placement Officer' : '🎓 Department HOD'}
                            </span>
                            {c.trainingAmount && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[9px] border border-emerald-500/30">
                                ₹{c.trainingAmount}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-200 max-w-xs truncate">{c.title}</div>
                        </td>

                        <td className="py-3 px-3">
                          {isGranted ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              ✅ Granted
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                              ⚠️ Expired
                            </span>
                          ) : isRevoked ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              🚫 Revoked
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              ⏳ Pending
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-[11px] text-slate-400">
                          {new Date(c.expiresAt).toLocaleDateString('en-IN')}
                        </td>

                        <td className="py-3 px-3 text-right space-x-2">
                          {!isRevoked && (
                            <button
                              onClick={() => handleRevokeConsent(c.consentId)}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-xs border border-rose-800 transition-all"
                              title="Revoke Consent Notice"
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
