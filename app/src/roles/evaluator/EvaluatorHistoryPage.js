import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaSync, FaStar, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function EvaluatorHistoryPage() {
  const { user } = useAuth();
  const { currentTenant, tenantLoading } = useTenant();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/evaluations`, {
        params: {
          tenantId: currentTenant.tenantId,
          evaluatorId: user?.id || user?._id
        }
      });
      setEvaluations(res.data.evaluations || []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError('⚠️ Unable to load evaluation history. Ensure REST API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant?.tenantId, user?.id, user?._id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const decisionBadge = (decision) => {
    switch ((decision || '').toUpperCase()) {
      case 'RECOMMEND': return 'text-emerald-700 bg-emerald-50';
      case 'REJECT': return 'text-rose-700 bg-rose-50';
      case 'ON_HOLD': return 'text-amber-700 bg-amber-50';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">PAGE 8 OF 10 • EVALUATION HISTORY</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Past Candidate Scorecards Log</h1>
            <p className="text-xs text-slate-500">
              Historical panel evaluations for {currentTenant?.name || ''}
              {lastRefresh && <span className="ml-2 text-slate-400">— Refreshed: {lastRefresh}</span>}
            </p>
          </div>
          <button
            id="btn-refresh-eval-history"
            onClick={fetchHistory}
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

        {!error && evaluations.length === 0 && !loading && (
          <div className="p-6 text-center text-slate-400 text-xs">
            No evaluation history found for this tenant.
          </div>
        )}

        <div className="space-y-3">
          {evaluations.map((item, i) => (
            <div key={item._id || i} className="p-4 neu-card flex justify-between items-start flex-wrap gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {item.candidateName || item.studentName || ''}
                </h4>
                <p className="text-xs text-slate-600">
                  {item.round || item.driveTitle || ''} · Score:{' '}
                  <strong className="text-slate-800">
                    {item.score != null ? `${item.score}/10` : '—'}
                  </strong>
                </p>
                {item.remarks && (
                  <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{item.remarks}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.score != null && (
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <FaStar />
                    <span>{item.score}</span>
                  </div>
                )}
                <span className={`text-[10px] font-bold py-0.5 px-2 rounded ${decisionBadge(item.decision || item.recommendation)}`}>
                  {item.decision || item.recommendation || ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EvaluatorHistoryPage;
