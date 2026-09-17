import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { FaFilePdf, FaFileAlt, FaEdit, FaCheckCircle, FaTimes } from "react-icons/fa";
import axios from "axios";

export function MentorResumeReviewPage() {
  const { currentTenant } = useTenant();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track per-card feedback edits: { [id]: string }
  const [feedbacks, setFeedbacks] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchResumeRequests = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.users) {
        const studentUsers = res.data.users
          .filter((u) => u.role === "student" && u.resumeData)
          .map((u, idx) => ({
            id: u._id || u.id || String(idx),
            studentName: u.name || "",
            resumeName: u.resumeFileName
              || `${u.name ? u.name.replace(/\s+/g, "_") : "Student"}_Resume.pdf`,
            // Feedback starts empty — mentor must type it themselves
            feedback: "",
            reviewed: false,
          }));
        setRequests(studentUsers);
        // Initialise feedback map with empty strings
        const initFb = {};
        studentUsers.forEach((r) => { initFb[r.id] = ""; });
        setFeedbacks(initFb);
      } else {
        setRequests([]);
      }
    } catch (e) {
      console.error("Failed to fetch resume review queue:", e);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchResumeRequests();
  }, [fetchResumeRequests]);

  const saveFeedback = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, feedback: feedbacks[id] || "" } : r))
    );
    setEditingId(null);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const toggleReview = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reviewed: !r.reviewed } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 6 OF 11 • RESUME REVIEW QUEUE</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Mentee PDF Resume Review Queue</h1>
        <p className="text-xs text-slate-500">
          Write your feedback for each student resume from {currentTenant?.name || "your institution"}
        </p>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold animate-pulse">
            Loading mentee resume review queue...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 neu-card text-center space-y-3">
            <FaFileAlt className="text-4xl text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Student Resumes Submitted for Review</h4>
            <p className="text-xs text-slate-500">
              Student PDF resume uploads will appear here. You can then type your own feedback for each one.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="p-5 neu-card space-y-3">
                {/* Student name + resume */}
                <div className="flex items-center gap-2">
                  <FaFilePdf className="text-red-500 text-lg shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{r.studentName}</h4>
                    <p className="text-[11px] text-slate-500">{r.resumeName}</p>
                  </div>
                </div>

                {/* Feedback section */}
                {editingId === r.id ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600">
                      Your Feedback
                    </label>
                    <textarea
                      rows={4}
                      autoFocus
                      placeholder="Write your resume feedback here — e.g. strengthen the projects section, add quantifiable achievements..."
                      value={feedbacks[r.id] || ""}
                      onChange={(e) =>
                        setFeedbacks((prev) => ({ ...prev, [r.id]: e.target.value }))
                      }
                      className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveFeedback(r.id)}
                        className="neu-btn-primary text-xs font-bold flex items-center gap-1"
                      >
                        <FaCheckCircle /> Save Feedback
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="neu-btn-secondary text-xs flex items-center gap-1"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {r.feedback ? (
                      <div className="p-3 neu-card bg-emerald-50/60 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-emerald-800">Your Feedback:</span>
                        <p>{r.feedback}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No feedback written yet. Click "Write Feedback" to add your review.
                      </p>
                    )}
                    {savedId === r.id && (
                      <p className="text-[11px] text-emerald-600 font-bold">✓ Feedback saved</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setEditingId(r.id)}
                        className="neu-btn-secondary text-xs font-bold flex items-center gap-1"
                      >
                        <FaEdit /> {r.feedback ? "Edit Feedback" : "Write Feedback"}
                      </button>
                      <button
                        onClick={() => toggleReview(r.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                          r.reviewed
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : "neu-btn-primary"
                        }`}
                      >
                        {r.reviewed ? "✓ Review Complete" : "Mark as Reviewed"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorResumeReviewPage;
