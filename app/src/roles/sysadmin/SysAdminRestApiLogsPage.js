import React, { useState, useEffect } from "react";
import { FaSync, FaCircle } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function SysAdminRestApiLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/sysadmin/rest-logs`);
      setLogs(res.data.logs || []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError('⚠️ Unable to reach backend. Ensure REST API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const methodColor = (method) => {
    switch (method) {
      case 'GET': return 'text-emerald-700 bg-emerald-50';
      case 'POST': return 'text-blue-700 bg-blue-50';
      case 'PATCH': case 'PUT': return 'text-amber-700 bg-amber-50';
      case 'DELETE': return 'text-rose-700 bg-rose-50';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  const statusColor = (status) => {
    if (status >= 500) return 'text-rose-700 font-bold';
    if (status >= 400) return 'text-amber-700 font-bold';
    if (status >= 200 && status < 300) return 'text-emerald-700 font-bold';
    return 'text-slate-600';
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">PAGE 6 OF 10 • REST API GATEWAY LOGS</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">REST API Gateway & Endpoint Diagnostics</h1>
            <p className="text-xs text-slate-500">
              Live HTTP request logs captured on port 5001
              {lastRefresh && <span className="ml-2 text-slate-400">— Last refresh: {lastRefresh}</span>}
            </p>
          </div>
          <button
            id="btn-refresh-rest-logs"
            onClick={fetchLogs}
            disabled={loading}
            className="neu-card px-4 py-2 text-xs font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="p-3 neu-card bg-rose-50 border-rose-200 text-rose-800 text-xs font-bold">
            {error}
          </div>
        )}

        {!error && logs.length === 0 && !loading && (
          <div className="p-6 text-center text-slate-400 text-xs">
            No API requests logged yet. Make some API calls to see them here.
          </div>
        )}

        <div className="space-y-2 font-mono text-xs">
          {logs.slice().reverse().map((l, i) => (
            <div key={i} className="p-3 neu-card flex justify-between items-center bg-white flex-wrap gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-[10px] font-bold py-0.5 px-2 rounded ${methodColor(l.method)}`}>
                  {l.method}
                </span>
                <span className="font-bold text-slate-800 truncate max-w-xs" title={l.url}>
                  {l.url}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 flex-shrink-0">
                <span className={statusColor(l.status)}>HTTP {l.status}</span>
                <span>{l.latency}ms</span>
                <span className="text-slate-400">
                  {l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {logs.length > 0 && (
          <p className="text-xs text-slate-400 text-right">
            <FaCircle className="inline mr-1 text-emerald-500" />
            {logs.length} request{logs.length !== 1 ? 's' : ''} captured since server start
          </p>
        )}
      </div>
    </div>
  );
}

export default SysAdminRestApiLogsPage;
