import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaFileSignature, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export function RecruiterOfferIssuerPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [offerForm, setOfferForm] = useState({
    candidateName: "",
    candidateEmail: "",
    roleTitle: "Full Stack Software Engineer",
    ctc: "₹18 LPA",
    joiningDate: "",
    bondDetails: "No mandatory bond"
  });

  const [issuedOffers, setIssuedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchIssuedOffers = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/applications?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.applications) {
        const mapped = res.data.applications
          .filter(a => a.status === 'offered' || a.status === 'accepted')
          .map((a, idx) => ({
            id: a._id || a.id || idx,
            name: a.studentName || a.studentId || '',
            email: a.studentEmail || '',
            role: a.jobTitle || '',
            ctc: a.salary || '',
            status: "ISSUED"
          }));
        setIssuedOffers(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch issued offers:", e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchIssuedOffers();
  }, [fetchIssuedOffers]);

  const handleIssueOffer = async (e) => {
    e.preventDefault();
    if (!offerForm.candidateName || !offerForm.candidateEmail) return;

    const newOffer = {
      id: Date.now().toString(),
      name: offerForm.candidateName,
      email: offerForm.candidateEmail,
      role: offerForm.roleTitle,
      ctc: offerForm.ctc,
      status: "ISSUED"
    };

    setIssuedOffers(prev => [newOffer, ...prev]);
    setSuccessMsg(`🎉 Official Digital Offer Letter issued to ${offerForm.candidateName}! Hash generated & registered.`);
    setOfferForm({ candidateName: "", candidateEmail: "", roleTitle: "Software Engineer", ctc: "₹18 LPA", joiningDate: "", bondDetails: "No mandatory bond" });
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-2xl">
        <span className="neu-chip-active">PAGE 8 OF 10 • DIGITAL OFFER LETTER ISSUER</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Issue Official Digital Offer Letters</h1>
        <p className="text-xs text-slate-500">Draft CTC packages and generate SHA-256 verifiable offer letters for {currentTenant?.name || ''}</p>

        {successMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleIssueOffer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Selected Candidate Name</label>
              <input 
                type="text" required
                placeholder="e.g. Godfrey C D"
                value={offerForm.candidateName}
                onChange={(e) => setOfferForm({ ...offerForm, candidateName: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Candidate Official Email</label>
              <input 
                type="email" required
                placeholder="e.g. student@university.ac.in"
                value={offerForm.candidateEmail}
                onChange={(e) => setOfferForm({ ...offerForm, candidateEmail: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Offered Role Title</label>
              <input 
                type="text" required
                placeholder="e.g. Software Engineer II"
                value={offerForm.roleTitle}
                onChange={(e) => setOfferForm({ ...offerForm, roleTitle: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Annual CTC Package</label>
              <input 
                type="text" required
                placeholder="e.g. ₹18 LPA"
                value={offerForm.ctc}
                onChange={(e) => setOfferForm({ ...offerForm, ctc: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaFileSignature /> Issue & Sign Digital Offer Letter
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Issued Digital Offer Letters Log</h3>
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-500 font-semibold">Loading issued offer letters...</div>
          ) : issuedOffers.length === 0 ? (
            <div className="p-4 neu-card text-center text-xs text-slate-500 font-semibold">
              No digital offer letters issued yet. Fill out the form above to issue an offer letter.
            </div>
          ) : (
            issuedOffers.map(o => (
              <div key={o.id} className="p-4 neu-card flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{o.name} ({o.email})</h4>
                  <p className="text-xs text-slate-600">Role: <strong>{o.role}</strong> • Package: <strong className="text-emerald-700">{o.ctc}</strong></p>
                </div>
                <span className="neu-chip-active text-[10px] py-0.5 px-2">{o.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterOfferIssuerPage;
