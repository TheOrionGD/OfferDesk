import React from "react";
import { useTenant } from "../../context/TenantContext";
import { FaBriefcase } from "react-icons/fa";

export function StudentTrackerPage({ applications = [] }) {
  const { currentTenant } = useTenant();

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 3 OF 10 • APPLICATION PIPELINE TRACKER</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Live Application Tracker</h1>
        <p className="text-xs text-slate-500">Real-time status synced with MongoDB database for {currentTenant?.name}</p>

        <div className="space-y-3">
          {applications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              No applications submitted yet. Visit the Active Drives tab to apply to corporate hiring drives!
            </div>
          ) : (
            applications.map(app => (
              <div key={app._id || app.id} className="p-5 neu-card flex justify-between items-center flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaBriefcase className="text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-800">Drive Reference ID: {app.jobId}</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Applied Date: {new Date(app.appliedAt || Date.now()).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                    app.status === 'shortlisted' || app.status === 'offered' ? 'neu-chip-active' :
                    app.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'neu-chip-inactive'
                  }`}>
                    {app.status?.toUpperCase() || 'APPLIED & IN REVIEW'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentTrackerPage;
