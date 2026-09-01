import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaPlus, FaReply, FaCheckCircle, FaTimes } from "react-icons/fa";
import axios from "axios";

export function MentorQnaPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [showModal, setShowModal] = useState(false);
  // Per-item reply state: { [id]: { text, editing } }
  const [replies, setReplies] = useState({});
  const [savedId, setSavedId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchQna = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/notices?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.notices) {
        const mapped = res.data.notices.map((n, idx) => ({
          id: n._id || n.id || String(idx),
          student: n.postedBy || "",
          // Only use the actual question text — no invented fallback
          question: n.title || "",
          // Answer starts empty — mentor types it
          answer: n.content || "",
        })).filter((item) => item.question); // only show items that have a real question
        setQnaList(mapped);
        const initReplies = {};
        mapped.forEach((q) => { initReplies[q.id] = { text: q.answer, editing: false }; });
        setReplies(initReplies);
      } else {
        setQnaList([]);
      }
    } catch (e) {
      console.error("Failed to fetch Q&A posts:", e);
      setQnaList([]);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchQna();
  }, [fetchQna]);

  // Mentor posts a new question on behalf of a student (or asks a prompt)
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const added = {
      id: Date.now().toString(),
      student: user?.name || "",
      question: newQuestion,
      answer: "",
    };
    setQnaList((prev) => [added, ...prev]);
    setReplies((prev) => ({ ...prev, [added.id]: { text: "", editing: false } }));
    setNewQuestion("");
    setShowModal(false);
  };

  const startReply = (id) => {
    setReplies((prev) => ({ ...prev, [id]: { ...prev[id], editing: true } }));
  };

  const saveReply = (id) => {
    const replyText = replies[id]?.text || "";
    setQnaList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer: replyText } : q))
    );
    setReplies((prev) => ({ ...prev, [id]: { text: replyText, editing: false } }));
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const cancelReply = (id) => {
    setReplies((prev) => ({
      ...prev,
      [id]: { text: qnaList.find((q) => q.id === id)?.answer || "", editing: false },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 8 OF 11 • STUDENT CAREER Q&amp;A FORUM</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Student Placement Q&amp;A Forum</h1>
            <p className="text-xs text-slate-500">
              Answer student queries on interview prep, resume building, and referrals for{" "}
              {currentTenant?.name || "your institution"}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="neu-btn-primary text-xs font-bold flex items-center gap-2"
          >
            <FaPlus /> Post a Question
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold animate-pulse">
            Loading Q&amp;A forum...
          </div>
        ) : qnaList.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold neu-card">
            No questions yet. Students can ask questions, or you can post one above for discussion.
          </div>
        ) : (
          <div className="space-y-4">
            {qnaList.map((item) => (
              <div key={item.id} className="p-5 neu-card space-y-3">
                {/* Question */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {item.student ? `Question from ${item.student}` : "Question"}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-0.5">{item.question}</h4>
                </div>

                {/* Mentor answer area */}
                {replies[item.id]?.editing ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-emerald-700">Your Answer</label>
                    <textarea
                      rows={4}
                      autoFocus
                      placeholder="Type your detailed answer here..."
                      value={replies[item.id]?.text || ""}
                      onChange={(e) =>
                        setReplies((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], text: e.target.value },
                        }))
                      }
                      className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveReply(item.id)}
                        className="neu-btn-primary text-xs font-bold flex items-center gap-1"
                      >
                        <FaCheckCircle /> Post Answer
                      </button>
                      <button
                        onClick={() => cancelReply(item.id)}
                        className="neu-btn-secondary text-xs flex items-center gap-1"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {item.answer ? (
                      <div className="p-3 neu-card bg-emerald-50/60 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-emerald-800">Mentor Response:</span>
                        <p>{item.answer}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No answer posted yet — click below to reply.
                      </p>
                    )}
                    {savedId === item.id && (
                      <p className="text-[11px] text-emerald-600 font-bold">✓ Answer saved</p>
                    )}
                    <button
                      onClick={() => startReply(item.id)}
                      className="neu-btn-secondary text-xs font-bold flex items-center gap-1"
                    >
                      <FaReply /> {item.answer ? "Edit Answer" : "Reply to Question"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Post a Career Question</h3>
            <form onSubmit={handleAskQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Question</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. How should students approach system design interviews at mid-size companies?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="neu-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorQnaPage;
