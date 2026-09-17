import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { FaBell, FaExclamationTriangle, FaCheckCircle, FaRobot, FaBan, FaInfoCircle } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function NotificationCenter() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!currentTenant?.tenantId || !user?.id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications?tenantId=${currentTenant.tenantId}&userId=${user.id}&role=${user.role}`);
      if (res.data && res.data.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (e) {
      setErrorMsg('⚠️ Unable to load live notifications: Backend REST API is offline.');
    }
  }, [currentTenant, user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.warn('Failed to mark notification read.');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'AI_FLAG': return <FaBan className="text-rose-400 text-lg" />;
      case 'WARNING': return <FaExclamationTriangle className="text-amber-400 text-lg" />;
      case 'ALERT': return <FaRobot className="text-purple-400 text-lg" />;
      default: return <FaInfoCircle className="text-cyan-400 text-lg" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-gray-800 bg-slate-900/90 text-white shadow-2xl space-y-6">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="p-5 border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs font-bold rounded-full uppercase">
              Role Notification Center • {user?.role || 'Member'}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white flex items-center gap-2">
            <FaBell className="text-cyan-400" /> Notifications & AI System Broadcasts
          </h2>
          <p className="text-xs text-gray-300 mt-1">Real-time alerts, campus notices, toxicity flags, and session updates for {currentTenant?.name}.</p>
        </div>

        <div className="px-3 py-1.5 bg-slate-800 border border-gray-700 rounded-lg text-xs text-gray-300">
          Unread Alerts: <strong className="text-cyan-300 font-bold">{notifications.filter(n => !n.isRead).length}</strong>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
            No notifications for your role at this time.
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n._id || n.id} 
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${n.isRead ? 'bg-slate-900/60 border-gray-800 text-gray-300' : 'bg-slate-800/90 border-cyan-500/50 text-white shadow-lg'}`}
            >
              <div className="p-2 bg-slate-800 rounded-lg border border-gray-700 shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-200">{n.message}</p>
              </div>
              {!n.isRead && (
                <button 
                  onClick={() => markAsRead(n._id || n.id)}
                  className="px-3 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold rounded shrink-0 flex items-center gap-1"
                >
                  <FaCheckCircle /> Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationCenter;
