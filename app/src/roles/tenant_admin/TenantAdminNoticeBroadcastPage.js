import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../context/TenantContext";
import { FaBullhorn, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export function TenantAdminNoticeBroadcastPage({ notices = [], onPostNotice }) {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'URGENT' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) return;
    setSubmitting(true);
    if (onPostNotice) {
      await onPostNotice(noticeForm);
      setSuccessMsg("📢 Official Notice broadcasted successfully to all students & staff!");
      setNoticeForm({ title: '', content: '', category: 'URGENT' });
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-2xl">
        <span className="neu-chip-active">PAGE 7 OF 10 • OFFICIAL NOTICE BROADCAST CONSOLE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Broadcast Official Campus Placement Notices</h1>
        <p className="text-xs text-slate-500">Publish urgent notices & schedules to students of {currentTenant?.name}</p>

        {successMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notice Title</label>
            <input 
              type="text" required
              placeholder="e.g. Mandatory Pre-Placement Mock Interview Schedule for CSE & IT"
              value={noticeForm.title}
              onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notice Guidelines & Details</label>
            <textarea 
              rows={4} required
              placeholder="Detailed instructions for candidates..."
              value={noticeForm.content}
              onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" disabled={submitting} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaBullhorn /> {submitting ? 'Broadcasting Notice...' : 'Broadcast Notice to Candidates'}
          </button>
        </form>

        <div className="pt-4 space-y-3">
          <h4 className="text-xs uppercase font-bold text-slate-600">Broadcasted Notices Log ({notices.length})</h4>
          {notices.map(n => (
            <div key={n._id || n.id} className="p-4 neu-card space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">{n.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(n.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-600">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TenantAdminNoticeBroadcastPage;
