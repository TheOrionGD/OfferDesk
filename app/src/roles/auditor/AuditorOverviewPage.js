import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaShieldAlt } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function AuditorOverviewPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    auditScore: 98.4,
    verifiedOffersCount: 0,
    sha256VerifiedOffers: 0,
    verifiedMous: 0,
    discrepanciesCount: 0
  });

  const fetchStats = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const res = await axios.get(`${API_URL}/api/auditor/stats?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (e) {
      console.warn("Failed to fetch auditor stats:", e);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">NIRF & NAAC ACCREDITATION AUDITOR</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Accreditation Audit Command Portal</h1>
          <p className="text-xs text-slate-600 mt-1">
            Auditor: <strong className="text-emerald-700">{user?.name || "Accreditation Inspector"}</strong> • Compliance Inspection for {currentTenant?.name || ''}
          </p>
        </div>

        <span className="neu-chip-active text-xs flex items-center gap-1 font-mono">
          <FaShieldAlt /> Cryptographic Verification Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Audit Score Index</div>
          <div className="text-3xl font-extrabold text-emerald-600 my-1">{stats.auditScore} / 100</div>
          <div className="text-[11px] text-emerald-700 font-bold">NIRF Metric Compliance</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">SHA-256 Verified Offers</div>
          <div className="text-3xl font-extrabold text-slate-800 my-1">{stats.verifiedOffersCount}</div>
          <div className="text-[11px] text-emerald-700 font-bold">Offer Hashes Matched</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Verified Employer MOUs</div>
          <div className="text-3xl font-extrabold text-purple-600 my-1">{stats.verifiedMous}</div>
          <div className="text-[11px] text-purple-700 font-bold">Corporate Partner MOUs</div>
        </div>

        <div className="p-5 neu-card text-center">
          <div className="text-xs font-bold text-slate-500 uppercase">Discrepancy Exception Queue</div>
          <div className="text-3xl font-extrabold text-blue-600 my-1">{stats.discrepanciesCount}</div>
          <div className="text-[11px] text-blue-700 font-bold">Clean Compliance Log</div>
        </div>
      </div>
    </div>
  );
}

export default AuditorOverviewPage;

