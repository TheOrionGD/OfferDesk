import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaFolderOpen } from "react-icons/fa";
import axios from "axios";

export function MentorDirectoryPage() {
  const { currentTenant } = useTenant();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchMentors = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.users) {
        const mentorUsers = res.data.users
          .filter((u) => u.role === "mentor" || u.role === "alumni")
          .map((u) => ({
            id: u._id || u.id,
            name: u.name || "",
            // Only use what the user actually registered — no fallback invented values
            company: u.company || "",
            designation: u.designation || "",
            batch: u.batch || "",
            department: u.department || "",
            expertise: u.expertise || "",
            phone: u.phone || "",
          }));
        setMentors(mentorUsers);
      } else {
        setMentors([]);
      }
    } catch (e) {
      console.error("Failed to fetch mentors:", e);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 7 OF 11 • MENTOR DIRECTORY</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Verified Mentors Directory</h1>
        <p className="text-xs text-slate-500">
          Registered mentors from {currentTenant?.name || "your institution"} — data sourced directly from user profiles
        </p>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold animate-pulse">
            Loading mentor directory...
          </div>
        ) : mentors.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaFolderOpen className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Mentors Registered Yet</h4>
            <p className="text-xs text-slate-500">
              Mentor accounts registered under this institution will appear here automatically.
              Each mentor's data comes from their own profile — no placeholder data is shown.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((m) => (
              <div key={m.id} className="p-5 neu-card space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {m.name?.charAt(0) || "M"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{m.name || "—"}</h4>
                    {m.designation && (
                      <p className="text-[11px] text-slate-500">{m.designation}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                  {m.company && (
                    <div><span className="font-bold text-slate-500">Company:</span> {m.company}</div>
                  )}
                  {m.department && (
                    <div><span className="font-bold text-slate-500">Dept:</span> {m.department}</div>
                  )}
                  {m.batch && (
                    <div><span className="font-bold text-slate-500">Batch:</span> {m.batch}</div>
                  )}
                  {m.expertise && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {m.expertise.split(",").map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorDirectoryPage;
