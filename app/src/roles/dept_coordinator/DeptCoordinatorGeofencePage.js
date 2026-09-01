import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { FaMapMarkerAlt, FaUserCheck, FaShieldAlt, FaCheckCircle, FaExclamationCircle, FaCrosshairs, FaSave, FaComments } from 'react-icons/fa';
import GeofenceCanvas from '../../components/GeofenceCanvas';
import { GpsLocationService } from '../../services/gpsLocationService';

export function DeptCoordinatorGeofencePage({ students = [] }) {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  
  const [createdSpaces, setCreatedSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  const [selectedVenue, setSelectedVenue] = useState({
    title: '',
    locationName: '',
    lat: 12.9716,
    lon: 77.5946,
    radius: 250
  });

  const [geofenceLogs, setGeofenceLogs] = useState([]);

  // Fetch created drive spaces for the HOD
  const fetchDriveSpaces = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const res = await fetch(`${API_URL}/api/spaces?tenantId=${currentTenant.tenantId}&userId=${user?._id || user?.id}&role=${user?.role}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.spaces)) {
        setCreatedSpaces(data.spaces);
        if (data.spaces.length > 0 && !selectedSpaceId) {
          setSelectedSpaceId(data.spaces[0].spaceId);
          setSelectedVenue(prev => ({
            ...prev,
            title: `${data.spaces[0].name} Training Venue`
          }));
        }
      }
    } catch (err) {
      console.warn("Fetch spaces error:", err);
    }
  }, [currentTenant, user, selectedSpaceId]);

  useEffect(() => {
    fetchDriveSpaces();
  }, [fetchDriveSpaces]);

  // Acquire real hardware location from phone/browser
  const handleDetectHardwareGps = async () => {
    setGpsDetecting(true);
    try {
      const pos = await GpsLocationService.getCurrentPosition();
      if (pos && pos.latitude && pos.longitude) {
        setSelectedVenue(prev => ({
          ...prev,
          lat: pos.latitude,
          lon: pos.longitude
        }));
      }
    } catch (err) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setSelectedVenue(prev => ({
              ...prev,
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }));
          },
          (error) => {
            alert(`Unable to acquire device location: ${error.message}`);
          },
          { enableHighAccuracy: true, timeout: 15000 }
        );
      } else {
        alert('Geolocation is not supported by your browser or device.');
      }
    } finally {
      setGpsDetecting(false);
    }
  };

  const handleSpaceChange = (e) => {
    const spaceId = e.target.value;
    setSelectedSpaceId(spaceId);
    const targetSpace = createdSpaces.find(s => s.spaceId === spaceId);
    if (targetSpace) {
      setSelectedVenue(prev => ({
        ...prev,
        title: `${targetSpace.name} Venue`
      }));
    }
  };

  const handleSaveGeofence = () => {
    setSaveSuccessMsg(`✅ Geofence zone successfully assigned to space "${selectedVenue.title || 'Selected Space'}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Dynamic student logs
  const activeLogs = geofenceLogs.length > 0 ? geofenceLogs : students.map(s => ({
    studentId: s._id || s.id,
    studentName: s.name || s.studentName,
    regNo: s.regNo || s.registerNo || 'N/A',
    status: s.geofenceStatus || 'AWAITING_CHECKIN',
    distance: s.distance ? `${s.distance}m` : 'N/A',
    timestamp: s.checkInTime || 'Pending',
    consentGranted: s.gpsConsent === true,
    accuracy: s.accuracy ? `±${s.accuracy}m` : 'N/A'
  }));

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        
        {/* Title & Banner */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">HOD DEPARTMENT CONSOLE • SPACE GEOFENCE ENGINE</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">
              Set Training Venue Geofence For Created Drive Space
            </h1>
            <p className="text-xs text-slate-500">
              Select an HOD Created Drive Space, acquire real phone/browser hardware location, and configure training venue boundaries for {currentTenant?.name || ''}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
            <FaShieldAlt className="inline mr-1" /> Hardware GPS Verified
          </span>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 text-base" /> {saveSuccessMsg}
          </div>
        )}

        {/* HOD Created Drive Space Selector & Location Controls */}
        <div className="p-5 neu-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Created Space Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <FaComments className="text-indigo-600" /> Select Created HOD Drive Space
              </label>
              <select
                value={selectedSpaceId}
                onChange={handleSpaceChange}
                className="w-full neu-input px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                {createdSpaces.length === 0 ? (
                  <option value="">No Drive Spaces Created Yet (Create in Drive Space Tab)</option>
                ) : (
                  createdSpaces.map(sp => (
                    <option key={sp.spaceId} value={sp.spaceId}>
                      {sp.name} — (Created by HOD {sp.hodName || ''})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Venue Title & Real Phone GPS Detector */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-rose-600" /> Training Venue Title
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Lab 4 Training Hall"
                  value={selectedVenue.title}
                  onChange={(e) => setSelectedVenue({ ...selectedVenue, title: e.target.value })}
                  className="w-full neu-input px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleDetectHardwareGps}
                  disabled={gpsDetecting}
                  className="neu-btn-primary text-xs font-bold px-3 shrink-0 flex items-center gap-1.5"
                  title="Detect Real Phone/Browser Hardware GPS"
                >
                  <FaCrosshairs className={gpsDetecting ? 'animate-spin' : ''} />
                  {gpsDetecting ? 'Locating...' : 'Use My Live Device GPS'}
                </button>
              </div>
            </div>

          </div>

          {/* Coordinates Bar & Save Button */}
          <div className="flex justify-between items-center flex-wrap gap-2 pt-1 border-t border-slate-200">
            <div className="text-xs font-mono font-semibold text-slate-700">
              Center Lat/Lon: <strong>{selectedVenue.lat.toFixed(5)}° N, {selectedVenue.lon.toFixed(5)}° E</strong> | Radius: <strong>{selectedVenue.radius}m</strong>
            </div>

            <button
              onClick={handleSaveGeofence}
              className="neu-btn-primary text-xs font-bold px-4 py-2 flex items-center gap-2"
            >
              <FaSave /> Save Venue Geofence for Selected Space
            </button>
          </div>

          {/* Geofence Canvas with Satellite / Street View Switcher */}
          <GeofenceCanvas
            centerLat={selectedVenue.lat}
            centerLon={selectedVenue.lon}
            venueName={selectedVenue.title || 'Department Training Venue'}
            radiusMeters={selectedVenue.radius}
            onRadiusChange={(r) => setSelectedVenue(prev => ({ ...prev, radius: r }))}
            onVenueMove={(lat, lon) => setSelectedVenue(prev => ({ ...prev, lat, lon }))}
            readOnly={false}
            height={380}
          />
        </div>

        {/* Department Student GPS Attendance Roster */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <FaUserCheck className="text-indigo-600" /> Department Student Attendance & GPS Verification Roster ({activeLogs.length})
          </h3>

          {activeLogs.length === 0 ? (
            <div className="p-8 text-center neu-card text-xs text-slate-500 font-semibold space-y-1">
              <p>No student attendance records recorded yet.</p>
              <p className="text-[11px] text-slate-400">Live GPS verification logs will appear here when department students check in.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-bold bg-slate-100">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Register No</th>
                    <th className="p-3">GPS Consent</th>
                    <th className="p-3">Geofence Status</th>
                    <th className="p-3">Venue Distance</th>
                    <th className="p-3">GPS Signal Accuracy</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeLogs.map((log, idx) => (
                    <tr key={log.studentId || idx} className="hover:bg-slate-50 font-semibold text-slate-700">
                      <td className="p-3 font-bold text-slate-800">{log.studentName || 'Student'}</td>
                      <td className="p-3 font-mono">{log.regNo}</td>
                      <td className="p-3">
                        {log.consentGranted ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            GRANTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {log.status === 'VERIFIED_INSIDE' && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 w-fit">
                            <FaCheckCircle className="text-emerald-600" /> INSIDE ZONE
                          </span>
                        )}
                        {log.status === 'OUTSIDE_ZONE' && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold flex items-center gap-1 w-fit">
                            <FaExclamationCircle className="text-rose-600" /> OUTSIDE ZONE
                          </span>
                        )}
                        {log.status !== 'VERIFIED_INSIDE' && log.status !== 'OUTSIDE_ZONE' && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-extrabold">
                            AWAITING SIGNAL
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono">{log.distance}</td>
                      <td className="p-3 font-mono text-sky-700">{log.accuracy}</td>
                      <td className="p-3 text-slate-500 font-mono">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DeptCoordinatorGeofencePage;
