import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaSearch, FaArrowRight, FaMapMarkedAlt } from "react-icons/fa";
import DriveNavigationTracker from "../../components/DriveNavigationTracker";

export function StudentDrivesPage({ drives = [], onApplyDrive }) {
  const { currentTenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [minGpaFilter, setMinGpaFilter] = useState(0);
  const [activeNavDrive, setActiveNavDrive] = useState(null);

  const filteredDrives = drives.filter(d => {
    const matchesSearch = d.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGpa = (d.minGpa || 0) >= minGpaFilter;
    return matchesSearch && matchesGpa;
  });

  return (
    <div className="space-y-6">
      {/* Live GPS Venue Navigation & Attendance Panel */}
      {activeNavDrive && (
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
              <FaMapMarkedAlt /> ACTIVE DRIVE NAVIGATION & GEOFENCE ATTENDANCE MODE
            </span>
            <button 
              onClick={() => setActiveNavDrive(null)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200 px-3 py-1 rounded-xl"
            >
              Close Navigation
            </button>
          </div>
          <DriveNavigationTracker
            driveTitle={activeNavDrive.title}
            companyName={activeNavDrive.company}
            venueName={`${currentTenant?.name || 'Main Campus'} - Hall A`}
            venueLat={12.9716}
            venueLon={77.5946}
            radiusMeters={250}
          />
        </div>
      )}

      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 2 OF 10 • DRIVES DIRECTORY</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">
              Eligible Campus Recruitment Drives ({filteredDrives.length})
            </h1>
            <p className="text-xs text-slate-500">Live opportunity pipeline & GPS Venue Navigation for {currentTenant?.name || ''}</p>
          </div>

          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <div className="neu-input p-2 px-3 flex items-center gap-2 text-xs">
              <FaSearch className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search company or role..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none w-36 sm:w-48"
              />
            </div>

            <select
              value={minGpaFilter}
              onChange={(e) => setMinGpaFilter(Number(e.target.value))}
              className="neu-input px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value={0}>All Min CGPA</option>
              <option value={6.0}>Min CGPA ≥ 6.0</option>
              <option value={7.0}>Min CGPA ≥ 7.0</option>
              <option value={8.0}>Min CGPA ≥ 8.0</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredDrives.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              No campus drives matching filters for {currentTenant?.name}.
            </div>
          ) : (
            filteredDrives.map(drive => (
              <div key={drive._id || drive.id} className="p-5 neu-card neu-card-hover flex justify-between items-center flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="neu-chip-active text-[10px] py-0.5 px-2">{drive.company}</span>
                    <span className="text-xs text-slate-500 font-mono">Cutoff CGPA: <strong>{drive.minGpa || 6.0}</strong></span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800">{drive.title}</h4>
                  <p className="text-xs text-slate-600">
                    Location: {drive.location || ''} • Package: <strong className="text-emerald-700">{drive.salary || ''}</strong>
                  </p>
                  {drive.eligibleBranches && (
                    <div className="text-[11px] text-slate-500">
                      Branches: {Array.isArray(drive.eligibleBranches) ? drive.eligibleBranches.join(', ') : drive.eligibleBranches}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveNavDrive(drive)}
                    className="neu-btn-secondary text-xs font-bold flex items-center gap-1.5"
                  >
                    <FaMapMarkedAlt className="text-emerald-600" /> GPS Route & Geofence
                  </button>

                  <button 
                    onClick={() => onApplyDrive(drive._id || drive.id, drive.title)}
                    className="neu-btn-primary text-xs font-bold flex items-center gap-2"
                  >
                    1-Click Apply Drive <FaArrowRight />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDrivesPage;
