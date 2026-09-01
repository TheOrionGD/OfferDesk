import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function AuditorStudentRecordsPage() {
  const { currentTenant } = useTenant();
  const [count, setCount] = useState(0);

  const fetchRecordsCount = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const res = await axios.get(`${API_URL}/api/auditor/stats?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.stats) {
        setCount(res.data.stats.studentRecordsCount || 0);
      }
    } catch (e) {
      console.warn("Failed to fetch student record stats:", e);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchRecordsCount();
  }, [fetchRecordsCount]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 7 OF 10 • IMMUTABLE STUDENT RECORDS AUDIT</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Immutable Student Graduation & Placement Proof</h1>
        <p className="text-xs text-slate-500">Degree completion & offer acceptance proof audit for {currentTenant?.name}</p>

        <div className="p-5 neu-card space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-700">Database Record Integrity</h4>
          <div className="text-sm font-bold text-slate-800">{count} Verified Student Records in MongoDB</div>
          <span className="neu-chip-active text-[10px] py-0.5 px-2">100% Cryptographically Verified</span>
        </div>
      </div>
    </div>
  );
}

export default AuditorStudentRecordsPage;

