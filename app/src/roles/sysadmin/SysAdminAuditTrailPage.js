import React, { useState, useEffect, useCallback } from "react";
import { FaSync, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function SysAdminAuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/audit-logs`);
      setAuditLogs(res.data.logs || []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError('⚠️ Unable to reach backend. Ensure REST API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    try { return new Date(ts).toLocaleString(); } catch { return ts; }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">PAGE 10 OF 10 • ADMINISTRATIVE AUDIT TRAIL</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Global System Audit Trail & Event Logs</h1>
            <p className="text-xs text-slate-500">
              Immutable log of system configuration changes & administrative actions
              {lastRefresh && <span className="ml-2 text-slate-400">— Refreshed: {lastRefresh}</span>}
            </p>
          </div>
          <button
            id="btn-refresh-audit-trail"
            onClick={fetchLogs}
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

        {!error && auditLogs.length === 0 && !loading && (
          <div className="p-6 text-center text-slate-400 text-xs">
            No audit events recorded yet.
          </div>
        )}

        <div className="space-y-3">
          {auditLogs.map((a, i) => (
            <div key={a._id || i} className="p-4 neu-card flex justify-between items-center flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="neu-chip-active text-[10px] py-0.5 px-2">{a.action}</span>
                  <span className="text-xs font-bold text-slate-800">{a.details?.substring(0, 60)}{a.details?.length > 60 ? '…' : ''}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Actor: <strong>{a.actorId}</strong> · Role: {a.actorRole} · Tenant: {a.tenantId}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 flex-shrink-0">
                {formatTimestamp(a.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SysAdminAuditTrailPage;
