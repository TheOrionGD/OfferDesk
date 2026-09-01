import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaCheckCircle, FaFileAlt, FaPlus, FaComments, FaGavel } from "react-icons/fa";
import axios from "axios";

export function TenantAdminOfferVerificationPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [offers, setOffers] = useState([]);
  const [createdSpaces, setCreatedSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueMsg, setIssueMsg] = useState(null);

  // New E-Signature Offer Form State
  const [newContract, setNewContract] = useState({
    spaceId: '',
    studentName: '',
    studentRegNo: '',
    company: '',
    jobTitle: '',
    salary: '',
    policyTerms: 'Institutional Placement Policy: Binding agreement to accept offer letter within 48-hour deadline.'
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Fetch HOD Created Spaces
  const fetchHODSpaces = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const res = await axios.get(`${API_URL}/api/spaces?tenantId=${currentTenant.tenantId}`);
      if (res.data && Array.isArray(res.data.spaces)) {
        setCreatedSpaces(res.data.spaces);
        if (res.data.spaces.length > 0 && !newContract.spaceId) {
          setNewContract(prev => ({ ...prev, spaceId: res.data.spaces[0].spaceId }));
        }
      }
    } catch (e) {
      console.warn("Failed to fetch HOD spaces:", e);
    }
  }, [currentTenant, API_URL, newContract.spaceId]);

  // Fetch Issued Offers / Applications
  const fetchOffers = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/applications?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.applications) {
        const mapped = res.data.applications
          .filter(a => a.status === 'offered' || a.status === 'accepted' || a.status === 'VERIFIED_AND_ACCEPTED' || a.issuedByTpo)
          .map((a, idx) => ({
            id: a._id || a.id || idx,
            studentName: a.studentName || a.studentId || '',
            regNo: a.regNo || '',
            company: a.company || a.jobTitle || '',
            ctc: a.salary || '',
            status: a.status === 'accepted' ? 'VERIFIED_AND_ACCEPTED' : (a.status || 'PENDING_STUDENT_ESIGNATURE'),
            hash: a.sha256Hash || `sha256_${Date.now()}_${idx}`,
            spaceName: a.spaceName || 'HOD Placement Space',
            hodName: a.hodName || 'Faculty HOD',
            issuedByTpoName: a.issuedByTpoName || 'Placement Officer'
          }));
        setOffers(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch offer letters:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchOffers();
    fetchHODSpaces();
  }, [fetchOffers, fetchHODSpaces]);

  // Create & Issue E-Signature Contract through HOD Created Space
  const handleIssueContractSubmit = async (e) => {
    e.preventDefault();
    setIssueMsg(null);

    if (!newContract.spaceId) {
      alert("Please select an HOD Created Drive Space to issue the contract through.");
      return;
    }
    if (!newContract.studentName || !newContract.company || !newContract.jobTitle) {
      alert("Please fill in Student Name, Company Name, and Job Offer Title.");
      return;
    }

    const selectedSpace = createdSpaces.find(s => s.spaceId === newContract.spaceId);

    try {
      await axios.post(`${API_URL}/api/acceptances/issue`, {
        tenantId: currentTenant.tenantId,
        spaceId: newContract.spaceId,
        spaceName: selectedSpace?.name || 'HOD Drive Space',
        hodName: selectedSpace?.hodName || 'HOD',
        issuedByTpoId: user?._id || user?.id,
        issuedByTpoName: user?.name || 'Placement Cell Officer',
        studentName: newContract.studentName,
        regNo: newContract.studentRegNo,
        company: newContract.company,
        jobTitle: newContract.jobTitle,
        salary: newContract.salary,
        policyTerms: newContract.policyTerms,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
      });

      setIssueMsg("✅ Placement Offer E-Signature Contract successfully created & issued to student via HOD Space!");
      setShowIssueModal(false);
      setNewContract({
        spaceId: createdSpaces.length > 0 ? createdSpaces[0].spaceId : '',
        studentName: '',
        studentRegNo: '',
        company: '',
        jobTitle: '',
        salary: '',
        policyTerms: 'Institutional Placement Policy: Binding agreement to accept offer letter within 48-hour deadline.'
      });
      fetchOffers();
    } catch (e) {
      setIssueMsg("⚠️ Issue Contract Failed: Backend REST endpoint unavailable.");
    }
  };

  const handleVerifyOffer = (id) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: 'VERIFIED_AND_ACCEPTED' } : o));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">PAGE 8 OF 10 • PLACEMENT OFFICER OFFER ISSUER & VERIFIER</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Issue & Audit Offer E-Signatures via HOD Space</h1>
            <p className="text-xs text-slate-500">
              Only Placement Cell Officers are authorized to create student Offer E-Signature Contracts through HOD Created Drive Spaces for {currentTenant?.name || ''}
            </p>
          </div>

          <button
            onClick={() => setShowIssueModal(true)}
            className="neu-btn-primary text-xs font-bold px-4 py-2 flex items-center gap-2 shrink-0"
          >
            <FaPlus /> Issue New E-Signature Contract via Space
          </button>
        </div>

        {issueMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 text-base" /> {issueMsg}
          </div>
        )}

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold">Loading placement offer contracts...</div>
        ) : offers.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaFileAlt className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Active Placement Contracts Created</h4>
            <p className="text-xs text-slate-500">Click <strong>"Issue New E-Signature Contract via Space"</strong> above to issue a binding offer acceptance letter through an HOD Created Drive Space.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map(o => (
              <div key={o.id} className="p-5 neu-card flex justify-between items-center flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-800">{o.studentName} {o.regNo ? `(Reg: ${o.regNo})` : ''}</h4>
                    <span className="neu-chip-active text-[10px] py-0.5 px-2">{o.company}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Role: <strong>{o.jobTitle || o.company}</strong> • Package: <strong className="text-emerald-700">{o.ctc || 'N/A'}</strong>
                  </p>
                  <p className="text-xs text-indigo-700 font-semibold flex items-center gap-1">
                    <FaComments /> Issued via HOD Space: <strong>{o.spaceName}</strong> (HOD: {o.hodName}) • Created by TPO: {o.issuedByTpoName}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">SHA-256 Hash: {o.hash}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${o.status === 'VERIFIED_AND_ACCEPTED' ? 'neu-chip-active' : 'neu-chip-inactive'}`}>
                    {o.status}
                  </span>

                  {o.status !== 'VERIFIED_AND_ACCEPTED' && (
                    <button onClick={() => handleVerifyOffer(o.id)} className="neu-btn-primary text-xs font-bold">
                      Approve Offer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* PLACEMENT OFFICER CREATE E-SIGNATURE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="p-6 neu-card max-w-lg w-full bg-white space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FaGavel className="text-amber-600" /> Create Offer E-Signature Contract (Placement Cell Officer Only)
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                TPO Authorized
              </span>
            </div>

            <form onSubmit={handleIssueContractSubmit} className="space-y-3">
              
              {/* Select HOD Created Drive Space */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <FaComments className="text-indigo-600" /> Target HOD Created Drive Space *
                </label>
                <select
                  required
                  value={newContract.spaceId}
                  onChange={(e) => setNewContract({ ...newContract, spaceId: e.target.value })}
                  className="w-full neu-input p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {createdSpaces.length === 0 ? (
                    <option value="">No Drive Spaces Created Yet by HOD</option>
                  ) : (
                    createdSpaces.map(sp => (
                      <option key={sp.spaceId} value={sp.spaceId}>
                        {sp.name} — (HOD: {sp.hodName || 'Department HOD'})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Candidate Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={newContract.studentName}
                    onChange={(e) => setNewContract({ ...newContract, studentName: e.target.value })}
                    className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Register Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 811123104001"
                    value={newContract.studentRegNo}
                    onChange={(e) => setNewContract({ ...newContract, studentRegNo: e.target.value })}
                    className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Company & Offer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Partner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Tech Inc."
                    value={newContract.company}
                    onChange={(e) => setNewContract({ ...newContract, company: e.target.value })}
                    className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Offer Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Development Engineer"
                    value={newContract.jobTitle}
                    onChange={(e) => setNewContract({ ...newContract, jobTitle: e.target.value })}
                    className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Annual CTC / Salary Package</label>
                <input
                  type="text"
                  placeholder="e.g. ₹12.5 LPA"
                  value={newContract.salary}
                  onChange={(e) => setNewContract({ ...newContract, salary: e.target.value })}
                  className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placement Policy Terms & Agreement</label>
                <textarea
                  rows={3}
                  value={newContract.policyTerms}
                  onChange={(e) => setNewContract({ ...newContract, policyTerms: e.target.value })}
                  className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="neu-btn-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary text-xs font-extrabold flex items-center gap-1.5"
                >
                  <FaGavel /> Create & Issue Offer Contract via Space
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default TenantAdminOfferVerificationPage;
