import React, { useState } from "react";
import { FaSave, FaCheckCircle } from "react-icons/fa";
const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || `${AI_SERVICE_URL}`;

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function SysAdminSystemConfigPage() {
  const [config, setConfig] = useState({
    apiUrl: `${API_BASE_URL}`,
    aiFastApiUrl: `${AI_SERVICE_URL}`,
    brevoSenderEmail: 'noreply@offerdesk.io',
    maxPayloadMb: 15
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-xl">
        <span className="neu-chip-active">PAGE 9 OF 10 • SYSTEM ENVIRONMENT CONFIG</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Global SaaS Environment Variables</h1>
        <p className="text-xs text-slate-500">Configure REST API endpoints, AI microservices, & Brevo SMTP keys</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> System configuration saved!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Node REST API Endpoint</label>
            <input 
              type="text" 
              value={config.apiUrl}
              onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">FastAPI Python AI Microservice URL</label>
            <input 
              type="text" 
              value={config.aiFastApiUrl}
              onChange={(e) => setConfig({ ...config, aiFastApiUrl: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Brevo Sender Email</label>
            <input 
              type="email" 
              value={config.brevoSenderEmail}
              onChange={(e) => setConfig({ ...config, brevoSenderEmail: e.target.value })}
              className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaSave /> Update Environment Variables
          </button>
        </form>
      </div>
    </div>
  );
}

export default SysAdminSystemConfigPage;
