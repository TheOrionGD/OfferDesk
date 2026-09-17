import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function AuditorNIRFMetricsPage() {
  const { currentTenant } = useTenant();
  const [metrics, setMetrics] = useState({
    placementRate: '0.0%',
    medianSalary: '₹0 LPA',
    higherStudiesRate: '0.0%'
  });

  const fetchMetrics = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const res = await axios.get(`${API_URL}/api/auditor/nirf-metrics?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.metrics) {
        setMetrics(res.data.metrics);
      }
    } catch (e) {
      console.warn("Failed to fetch NIRF metrics:", e);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 5 OF 10 • NIRF METRIC PARAMETERS AUDIT</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">NIRF Metric 1.1 / 1.2 Placement Data Audit</h1>
        <p className="text-xs text-slate-500">Ministry of Education NIRF Ranking parameters for {currentTenant?.name}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Metric 1.1: Placement Rate</div>
            <div className="text-3xl font-extrabold text-emerald-600 my-1">{metrics.placementRate}</div>
            <div className="text-[11px] text-emerald-700 font-bold">Graduating Batch</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Metric 1.2: Median Salary</div>
            <div className="text-3xl font-extrabold text-blue-600 my-1">{metrics.medianSalary}</div>
            <div className="text-[11px] text-blue-700 font-bold">Audit Verified</div>
          </div>

          <div className="p-5 neu-card text-center">
            <div className="text-xs font-bold text-slate-500 uppercase">Metric 1.3: Higher Studies</div>
            <div className="text-3xl font-extrabold text-purple-600 my-1">{metrics.higherStudiesRate}</div>
            <div className="text-[11px] text-purple-700 font-bold">GATE / GRE / M.Tech</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditorNIRFMetricsPage;

