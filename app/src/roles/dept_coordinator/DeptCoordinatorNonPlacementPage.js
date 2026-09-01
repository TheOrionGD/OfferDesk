import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";

import axios from "axios";

export function DeptCoordinatorNonPlacementPage() {
  const { currentTenant } = useTenant();
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchPathways = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/non-placement/pathways?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.pathways) {
        setPathways(res.data.pathways);
      }
    } catch (e) {
      console.error('Failed to fetch non-placement pathways:', e);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchPathways();
  }, [fetchPathways]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 9 OF 10 • NON-PLACEMENT PATHWAYS CURATOR</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">HOD Non-Placement Career Pathways Curator</h1>
        <p className="text-xs text-slate-500">Curate GATE, GRE, UPSC, PSU, and Startup incubator tracks for {currentTenant?.name}</p>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500">Loading pathways...</div>
        ) : (
          <div className="space-y-3">
            {pathways.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 neu-card">
                No custom pathways created yet. Dynamic pathways loaded from MongoDB REST backend.
              </div>
            ) : (
              pathways.map(p => (
                <div key={p._id || p.domainKey} className="p-4 neu-card flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{p.title}</h4>
                    <p className="text-xs text-slate-600">{p.description}</p>
                  </div>
                  <span className="neu-chip-active text-[10px] py-0.5 px-2">{p.domainKey}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeptCoordinatorNonPlacementPage;
