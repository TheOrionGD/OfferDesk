import React, { useState, useEffect, useCallback } from "react";
import { FaSync, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function SysAdminDatabasePage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/sysadmin/database-stats`);
      setCollections(res.data.collections || []);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError('⚠️ Unable to reach backend. Ensure REST API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">PAGE 5 OF 10 • MONGODB DIAGNOSTICS & COLLECTIONS</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Native MongoDB Collection Metrics</h1>
            <p className="text-xs text-slate-500">
              Real-time database collection sizes & document counts
              {lastRefresh && <span className="ml-2 text-slate-400">— Refreshed: {lastRefresh}</span>}
            </p>
          </div>
          <button
            id="btn-refresh-db-stats"
            onClick={fetchStats}
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

        {!error && collections.length === 0 && !loading && (
          <div className="p-6 text-center text-slate-400 text-xs">
            No collection data returned from server.
          </div>
        )}

        {loading && collections.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-5 neu-card space-y-2 animate-pulse">
                <div className="h-3 bg-slate-200 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-32" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
            ))}
          </div>
        )}

        {collections.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {collections.map((c, i) => (
              <div key={i} className="p-5 neu-card space-y-2">
                <span className="neu-chip-active text-[10px] py-0.5 px-2 font-mono">db.{c.name}</span>
                <h4 className="text-sm font-bold text-slate-800">Total Documents: {c.docs}</h4>
                <p className="text-xs text-slate-600">Allocated Size: <strong>{c.size}</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SysAdminDatabasePage;
