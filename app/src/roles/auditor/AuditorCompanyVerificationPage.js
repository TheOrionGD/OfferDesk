import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaSync, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function AuditorCompanyVerificationPage() {
  const { currentTenant, tenantLoading } = useTenant();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchCompanies = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/auditor/companies`, {
        params: { tenantId: currentTenant.tenantId }
      });
      setCompanies(res.data.companies || []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError('⚠️ Unable to load company data. Ensure REST API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant?.tenantId]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (tenantLoading) {
    return (
      <div className="p-6 neu-card">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded w-40" />
          <div className="h-3 bg-slate-100 rounded w-64" />
        </div>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="p-6 neu-card">
        <p className="text-xs text-amber-700 font-bold">⚠️ No tenant selected. Please select a tenant from the tenant switcher.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">PAGE 4 OF 10 • EMPLOYER PARTNER MOU AUDIT</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Recruiter Partner MOU & Compliance Audit</h1>
            <p className="text-xs text-slate-500">
              Corporate employer MOU verification for {currentTenant?.name}
              {lastRefresh && <span className="ml-2 text-slate-400">— Refreshed: {lastRefresh}</span>}
            </p>
          </div>
          <button
            id="btn-refresh-companies"
            onClick={fetchCompanies}
            disabled={loading}
            className="neu-card px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="p-3 neu-card bg-rose-50 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {!error && companies.length === 0 && !loading && (
          <div className="p-6 text-center text-slate-400 text-xs">
            No recruiter partners have conducted drives for {currentTenant?.name} yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companies.map((c, i) => (
            <div key={i} className="p-5 neu-card space-y-2">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-600 text-xs" />
                <span className="neu-chip-active text-[10px] py-0.5 px-2">{c.mouStatus}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
              <p className="text-xs text-slate-600">Drives Conducted: <strong>{c.verifiedDrives}</strong></p>
              <div className="text-[11px] text-emerald-700 font-bold">Sector: {c.sector}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuditorCompanyVerificationPage;
