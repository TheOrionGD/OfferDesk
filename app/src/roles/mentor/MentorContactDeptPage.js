import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import {
  FaPhone, FaWhatsapp, FaFolderOpen,
  FaSearch, FaFilter, FaBriefcase
} from "react-icons/fa";
import axios from "axios";

const DEPARTMENTS = ["All", "CSE", "IT", "ECE", "MECH", "EEE", "CIVIL"];
const DEPT_COLOR = {
  CSE: "#10b981", IT: "#6366f1", ECE: "#f59e0b",
  MECH: "#ef4444", EEE: "#0ea5e9", CIVIL: "#a855f7"
};

export function MentorContactDeptPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [mentorList, setMentorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [contactModal, setContactModal] = useState(null);
  const [customMsg, setCustomMsg] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Fetch only real registered mentors — no static fallback data
  const fetchMentors = useCallback(async () => {
    if (!currentTenant?.tenantId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/users?tenantId=${currentTenant.tenantId}&role=mentor`
      );
      const users = (res.data?.users || []).filter(
        (u) => u.role === "mentor" || u.role === "alumni"
      );
      setMentorList(
        users.map((u, idx) => ({
          id: u._id || u.id || String(idx),
          name: u.name || "",
          department: u.department || "",
          company: u.company || "",
          designation: u.designation || "",
          batch: u.batch || "",
          phone: u.phone || "",
          expertise: u.expertise || "",
        }))
      );
    } catch {
      // Backend offline — show empty list, not fake data
      setMentorList([]);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => { fetchMentors(); }, [fetchMentors]);

  const defaultMessage = (m) =>
    `Hello ${m.name}! I am ${user?.name || "a Mentor"} from ${
      currentTenant?.name || "our institution"
    }. I would love to connect regarding mentorship in ${m.department || "your domain"}. Please let me know your availability.`;

  const openContactModal = (m) => {
    setContactModal(m);
    setCustomMsg(defaultMessage(m));
  };

  const handlePhoneCall = (phone) => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone, message) => {
    if (!phone) return;
    const clean = phone.replace(/[^\d]/g, "");
    window.open(
      `https://wa.me/${clean}?text=${encodeURIComponent(message || "")}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const filtered = mentorList.filter((m) => {
    const matchesDept = selectedDept === "All" || m.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.expertise.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-6 neu-card space-y-1">
        <span className="neu-chip-active">PAGE 11 OF 11 • DEPT MENTOR CONTACT</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Contact Mentors by Department</h1>
        <p className="text-xs text-slate-500">
          Browse and contact registered mentors from{" "}
          <strong className="text-emerald-700">
            {currentTenant?.name || "your institution"}
          </strong>{" "}
          via WhatsApp or Phone Call.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="p-4 neu-card space-y-3">
        <div className="flex items-center gap-2 neu-input px-3 py-2">
          <FaSearch className="text-slate-400 text-sm shrink-0" />
          <input
            type="text"
            placeholder="Search by name, company, department or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-slate-700 focus:outline-none placeholder:font-normal"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FaFilter className="text-slate-400 text-sm mt-0.5 shrink-0" />
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                selectedDept === dept ? "neu-chip-active--mentor" : "neu-chip-inactive"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Mentor Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-10 neu-card text-center">
            <div className="animate-pulse text-slate-400 text-xs font-semibold">
              Loading registered mentors from {currentTenant?.name}...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 neu-card text-center space-y-3">
            <FaFolderOpen className="text-4xl text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-600">
              {mentorList.length === 0 ? "No Mentors Registered Yet" : "No Mentors Match Filter"}
            </h4>
            <p className="text-xs text-slate-400">
              {mentorList.length === 0
                ? "Mentor accounts registered under this institution will appear here. Their contact details come from their own profile — no placeholder data is shown."
                : "Try changing the search query or department filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((m) => (
              <div key={m.id} className="p-4 neu-card space-y-3">
                {/* Top row */}
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${
                          DEPT_COLOR[m.department] || "#10b981"
                        }, #1e293b)`,
                      }}
                    >
                      {m.name?.charAt(0) || "M"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-800">{m.name}</h4>
                        {m.department && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                            style={{
                              backgroundColor: DEPT_COLOR[m.department] || "#10b981",
                            }}
                          >
                            {m.department}
                          </span>
                        )}
                      </div>
                      {(m.designation || m.company) && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {[m.designation, m.company].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                  {m.batch && (
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg shrink-0">
                      {m.batch} Batch
                    </span>
                  )}
                </div>

                {/* Expertise chips */}
                {m.expertise && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <FaBriefcase className="text-slate-400 text-[11px]" />
                    {m.expertise.split(",").map((s, si) => (
                      <span
                        key={si}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Contact Buttons */}
                {m.phone ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openContactModal(m)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white transition-all active:scale-95"
                      style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
                    >
                      <FaWhatsapp className="text-base" /> WhatsApp
                    </button>
                    <button
                      onClick={() => handlePhoneCall(m.phone)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white transition-all active:scale-95"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
                    >
                      <FaPhone className="text-sm" /> Phone Call
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    No phone number on profile — mentor must update their profile to enable contact.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-center text-[11px] text-slate-400 font-semibold pb-2">
          Showing {filtered.length} of {mentorList.length} registered mentors
        </p>
      )}

      {/* WhatsApp Modal */}
      {contactModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-sm w-full bg-white space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${
                    DEPT_COLOR[contactModal.department] || "#10b981"
                  }, #1e293b)`,
                }}
              >
                {contactModal.name?.charAt(0) || "M"}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Contact {contactModal.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {contactModal.phone}
                  {contactModal.department && ` · ${contactModal.department}`}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                WhatsApp Message (Editable)
              </label>
              <textarea
                rows={5}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleWhatsApp(contactModal.phone, customMsg)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white"
                style={{ background: "linear-gradient(135deg, #25d366, #128c7e)" }}
              >
                <FaWhatsapp className="text-base" /> Send WhatsApp
              </button>
              <button
                onClick={() => handlePhoneCall(contactModal.phone)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
              >
                <FaPhone className="text-sm" /> Call Now
              </button>
            </div>

            <button
              onClick={() => setContactModal(null)}
              className="w-full neu-btn-secondary text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorContactDeptPage;
