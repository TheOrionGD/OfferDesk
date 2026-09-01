import React, { useState } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaLaptopCode, FaPlus, FaTrash, FaCheckCircle } from "react-icons/fa";

export function MentorSandboxPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const [problems, setProblems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    starterCode: "",
    language: "JavaScript",
    difficulty: "Medium",
  });

  const LANGUAGES = ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go"];
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    setProblems((prev) => [
      {
        id: Date.now().toString(),
        ...form,
        postedBy: user?.name || "Mentor",
        postedAt: new Date().toLocaleDateString("en-IN"),
      },
      ...prev,
    ]);
    setForm({ title: "", description: "", starterCode: "", language: "JavaScript", difficulty: "Medium" });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id) => setProblems((prev) => prev.filter((p) => p.id !== id));

  const diffColor = { Easy: "text-emerald-600", Medium: "text-amber-600", Hard: "text-red-600" };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-6 neu-card space-y-1">
        <span className="neu-chip-active">PAGE 4 OF 11 • MOCK TECHNICAL SANDBOX</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Mock Technical Sandbox</h1>
        <p className="text-xs text-slate-500">
          Post coding challenges &amp; system design problems for {currentTenant?.name || "your institution"} students
        </p>
      </div>

      {saved && (
        <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FaCheckCircle className="text-emerald-600" /> Problem posted successfully!
        </div>
      )}

      {/* Post Problem Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="neu-btn-primary text-xs font-bold flex items-center gap-2"
        >
          <FaPlus /> {showForm ? "Cancel" : "Post New Problem"}
        </button>
      </div>

      {/* Problem Form */}
      {showForm && (
        <div className="p-5 neu-card space-y-4 border-l-4 border-purple-400">
          <h3 className="text-sm font-bold text-slate-800">New Coding / Design Problem</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Problem Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Implement LRU Cache in O(1) time"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Problem Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe the problem statement, constraints, and expected input/output..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full neu-input p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Starter Code Snippet (optional)</label>
              <textarea
                rows={4}
                placeholder="// Paste your starter/template code here..."
                value={form.starterCode}
                onChange={(e) => setForm({ ...form, starterCode: e.target.value })}
                className="w-full neu-input p-3 text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="neu-btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="neu-btn-primary text-xs font-bold">
                Post Problem
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Problem List */}
      {problems.length === 0 ? (
        <div className="p-10 neu-card text-center space-y-3">
          <FaLaptopCode className="text-4xl text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-600">No Problems Posted Yet</h4>
          <p className="text-xs text-slate-400">
            Use the button above to post your first coding or system design challenge for students.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((p) => (
            <div key={p.id} className="p-5 neu-card space-y-3">
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <FaLaptopCode className="text-emerald-600 text-sm" />
                    <h4 className="text-sm font-bold text-slate-800">{p.title}</h4>
                    <span className={`text-[11px] font-bold ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">{p.language}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Posted by {p.postedBy} · {p.postedAt}</p>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <FaTrash className="text-xs" />
                </button>
              </div>
              <p className="text-xs text-slate-600">{p.description}</p>
              {p.starterCode && (
                <pre className="p-3 neu-input font-mono text-xs text-slate-800 bg-white overflow-x-auto whitespace-pre-wrap">
                  {p.starterCode}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MentorSandboxPage;
