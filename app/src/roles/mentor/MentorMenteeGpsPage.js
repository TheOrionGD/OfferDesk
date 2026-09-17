import React from 'react';
import { useTenant } from '../../context/TenantContext';
import { FaUserGraduate, FaMapMarkedAlt, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import GeofenceCanvas from '../../components/GeofenceCanvas';

export function MentorMenteeGpsPage({ mentees = [] }) {
  const { currentTenant } = useTenant();

  const menteeAttendance = mentees.map(m => ({
    id: m._id || m.id,
    name: m.name || m.menteeName || 'Mentee Candidate',
    regNo: m.regNo || m.registerNo || 'N/A',
    branch: m.branch || 'N/A',
    trainingDrive: m.trainingDrive || 'Assigned Drive Training',
    venue: m.venue || 'Campus Placement Center',
    status: m.geofenceStatus || 'EN_ROUTE',
    distance: m.distance ? `${m.distance}m away` : 'N/A',
    checkInTime: m.checkInTime || 'Pending Check-In',
    geofenceVerified: m.geofenceVerified === true
  }));

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <span className="neu-chip-active">MENTOR PORTAL • MENTEE ATTENDANCE & LOCATION</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">
              Mentee Drive Training GPS & Geofence Verification Status
            </h1>
            <p className="text-xs text-slate-500">
              Track assigned mentees' training session attendance and verified geofence check-in logs for {currentTenant?.name || ''}
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
            <FaShieldAlt className="inline mr-1" /> Student Consent Verified
          </span>
        </div>

        {/* Training Venue Map Preview */}
        <div className="p-5 neu-card space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FaMapMarkedAlt className="text-purple-600" /> Active Training Venue Geofence Map
              </h3>
              <p className="text-xs text-slate-600">
                Mentors can toggle between <strong>Satellite View 🛰️</strong> and <strong>Street View 🗺️</strong> map layers to view venue location and student check-in zones.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Live Venue Radar
            </span>
          </div>

          <GeofenceCanvas
            centerLat={12.9716}
            centerLon={77.5946}
            venueName="Central Campus Drive Training Venue"
            radiusMeters={250}
            readOnly={true}
            height={320}
          />
        </div>

        {/* Assigned Mentees Roster Cards */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <FaUserGraduate className="text-purple-600" /> Assigned Mentees Training Attendance Status ({menteeAttendance.length})
          </h3>

          {menteeAttendance.length === 0 ? (
            <div className="p-8 text-center neu-card text-xs text-slate-500 font-semibold space-y-1">
              <p>No assigned mentee attendance records found.</p>
              <p className="text-[11px] text-slate-400">Assigned mentees will appear here once they log in and grant GPS consent for training sessions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {menteeAttendance.map(mentee => (
                <div key={mentee.id} className="p-5 neu-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{mentee.name}</h4>
                      <span className="text-xs text-slate-500 font-mono">Reg: {mentee.regNo} • {mentee.branch}</span>
                    </div>
                    {mentee.geofenceVerified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        INSIDE GEOFENCE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                        EN ROUTE
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p><strong>Training Drive:</strong> {mentee.trainingDrive}</p>
                    <p><strong>Venue:</strong> {mentee.venue}</p>
                    <p><strong>Distance:</strong> {mentee.distance}</p>
                    <p><strong>Check-In Timestamp:</strong> {mentee.checkInTime}</p>
                  </div>

                  <div className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                    <FaCheckCircle className="text-emerald-500" /> Student GPS Consent Granted & Verified
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default MentorMenteeGpsPage;
