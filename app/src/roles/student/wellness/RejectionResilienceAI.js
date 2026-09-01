import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaExternalLinkAlt, FaCompass, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function RejectionResilienceAI({ rejectedJobTitle, skillGap }) {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [activeTitle, setActiveTitle] = useState(rejectedJobTitle || '');
  const [activeSkills, setActiveSkills] = useState(skillGap || []);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!rejectedJobTitle && currentTenant?.tenantId && user?.id) {
      axios.get(`${API_BASE_URL}/api/applications?tenantId=${currentTenant.tenantId}&studentId=${user.id}`)
        .then(res => {
          if (res.data && res.data.applications) {
            const rejected = res.data.applications.find(a => a.status === 'rejected');
            if (rejected) {
              setActiveTitle(`Drive ${rejected.jobId}`);
              setActiveSkills(['Algorithm Optimization', 'System Architecture & Scaling']);
            }
          }
        })
        .catch(() => {
          setErrorMsg('⚠️ Service Currently Unavailable: REST Backend API is offline.');
        });
    }
  }, [rejectedJobTitle, currentTenant, user]);

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-slate-900/90 text-white shadow-xl space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
        <div className="p-3 bg-purple-950 border border-purple-700 rounded-xl text-purple-400">
          <FaCompass className="text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">Rejection Resilience & Skill Growth Pathway AI</h3>
          <p className="text-xs text-purple-300">Turning placement rejections into constructive AI skill-gap roadmaps</p>
        </div>
      </div>

      {activeTitle ? (
        <>
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60">
            <h4 className="text-xs font-bold uppercase text-purple-300 mb-1">Targeted Skill Gap Analysis for: {activeTitle}</h4>
            <p className="text-xs text-gray-300">Targeted skill growth areas to elevate your profile before your next campus drive:</p>
          </div>

          <div className="space-y-3">
            {activeSkills.map((skill, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-800/70 border border-gray-700 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <span className="font-semibold text-sm text-gray-200">{skill}</span>
                </div>
                <a 
                  href="https://coursera.org" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded border border-gray-700"
                >
                  <FaGraduationCap /> Free Prep Course <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">
          No rejection records found for current candidate. Active applications are in progress!
        </div>
      )}
    </div>
  );
}

export default RejectionResilienceAI;
