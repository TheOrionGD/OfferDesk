import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaSave, FaCheckCircle } from 'react-icons/fa';

export function StudentSettingsPage() {
  const { currentTenant, tenants, switchTenant } = useTenant();
  const { user } = useAuth();

  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [msg, setMsg] = useState(false);

  const handleSaveSettings = () => {
    setMsg(true);
    setTimeout(() => setMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 10 OF 10 • STUDENT SUITE SETTINGS</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Student Account & Preference Settings</h1>
        <p className="text-xs text-slate-600">Institution tenant switcher & notification toggles</p>

        {msg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Preferences saved!
          </div>
        )}

        <div className="space-y-4 max-w-xl">
          <div className="p-4 neu-card space-y-2">
            <label className="block text-xs uppercase font-bold text-slate-600">Selected Institution Tenant</label>
            <select
              value={currentTenant?.tenantId || ''}
              onChange={(e) => switchTenant(e.target.value)}
              className="w-full neu-input p-3 text-xs font-bold text-slate-800 focus:outline-none"
            >
              {tenants.map(t => (
                <option key={t.tenantId} value={t.tenantId}>
                  {t.code} - {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 neu-card space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
              <FaBell className="text-emerald-600" /> Notification Preferences
            </h4>

            <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
              <span>Mobile Push Notifications (Capacitor Native)</span>
              <input 
                type="checkbox" 
                checked={notifPush}
                onChange={(e) => setNotifPush(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
              <span>Brevo Email Notifications (Campus Drives)</span>
              <input 
                type="checkbox" 
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>
          </div>

          <button onClick={handleSaveSettings} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentSettingsPage;
