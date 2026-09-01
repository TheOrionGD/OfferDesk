import React, { useState, useEffect } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaMapMarkerAlt } from "react-icons/fa";
import GeofenceCanvas from "../../components/GeofenceCanvas";

export function TenantAdminDriveAuthPage({ drives = [], onToggleApproval }) {
  const { currentTenant } = useTenant();
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [geofenceRadius, setGeofenceRadius] = useState(250);
  const [venueCoords, setVenueCoords] = useState({ lat: 12.9716, lon: 77.5946 });

  useEffect(() => {
    if (selectedDrive?.venueLat && selectedDrive?.venueLon) {
      setVenueCoords({ lat: selectedDrive.venueLat, lon: selectedDrive.venueLon });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setVenueCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {}
      );
    }
  }, [selectedDrive]);


  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 2 OF 10 • DRIVE AUTHORIZATION CONSOLE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Recruitment Drive Authorization & Geofence Manager</h1>
        <p className="text-xs text-slate-500">Authorize corporate partner recruitment drives and configure venue geofences for {currentTenant?.name}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drives.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card md:col-span-3">No drives available to authorize.</div>
          ) : (
            drives.map(drive => (
              <div 
                key={drive._id || drive.id} 
                className={`p-5 neu-card space-y-3 cursor-pointer transition-all ${
                  selectedDrive?._id === drive._id ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setSelectedDrive(drive)}
              >
                <div className="flex justify-between items-start">
                  <span className="neu-chip-active text-[10px] py-0.5 px-2">{drive.company}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${drive.approvedByTenantAdmin ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                    {drive.approvedByTenantAdmin ? 'APPROVED' : 'PENDING'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-800">{drive.title}</h4>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><strong>Min CGPA Cutoff:</strong> {drive.minGpa} / 10.0</p>
                  <p><strong>Eligible Branches:</strong> {drive.eligibleBranches ? (Array.isArray(drive.eligibleBranches) ? drive.eligibleBranches.join(', ') : drive.eligibleBranches) : 'All Branches'}</p>
                  <p className="text-emerald-700 font-semibold">
                    <FaMapMarkerAlt className="inline mr-1" /> Venue Geofence Zone Active
                  </p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleApproval(drive._id || drive.id);
                  }}
                  className="w-full neu-btn-secondary text-xs font-bold"
                >
                  Toggle Drive Authorization Status
                </button>
              </div>
            ))
          )}
        </div>

        {/* Interactive Geofence Canvas Console */}
        <div className="p-6 neu-card space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Venue Geofence Setup: {selectedDrive?.title || 'Selected Drive Venue'}
              </h3>
              <p className="text-xs text-slate-500">
                Use the canvas toggle button to switch between <strong>Satellite View 🛰️</strong> and <strong>Street View 🗺️</strong> map base layers. Click canvas to adjust venue center pin.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Radius: {geofenceRadius}m Zone
            </span>
          </div>

          <GeofenceCanvas
            centerLat={venueCoords.lat}
            centerLon={venueCoords.lon}
            venueName={selectedDrive ? `${selectedDrive.company} - ${selectedDrive.title}` : 'Campus Main Placement Center'}
            radiusMeters={geofenceRadius}
            onRadiusChange={(r) => setGeofenceRadius(r)}
            onVenueMove={(lat, lon) => setVenueCoords({ lat, lon })}
            readOnly={false}
            height={380}
          />
        </div>
      </div>
    </div>
  );
}

export default TenantAdminDriveAuthPage;
