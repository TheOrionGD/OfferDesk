import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function EvaluatorQuestionBankPage() {
  const { currentTenant } = useTenant();
  const [topic, setTopic] = useState('ALL');
  const [questions, setQuestions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ category: 'DSA', q: '', difficulty: 'Medium', rubric: '' });
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const res = await axios.get(`${API_URL}/api/evaluator/question-bank?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.questions) {
        setQuestions(res.data.questions);
      }
    } catch (e) {
      console.warn("Failed to fetch evaluator questions:", e);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.q.trim()) return;
    try {
      await axios.post(`${API_URL}/api/evaluator/question-bank?tenantId=${currentTenant.tenantId}`, newQuestion);
      setNewQuestion({ category: 'DSA', q: '', difficulty: 'Medium', rubric: '' });
      setShowAddForm(false);
      fetchQuestions();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add question to database.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/evaluator/question-bank/${id}?tenantId=${currentTenant.tenantId}`);
      fetchQuestions();
    } catch (err) {
      setErrorMsg('Failed to delete question.');
    }
  };

  const filtered = questions.filter(q => topic === 'ALL' || q.category === topic);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 5 OF 10 • TECHNICAL QUESTION BANK</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Panelist Technical Question Bank</h1>
            <p className="text-xs text-slate-500">Structured technical interview questions by domain & difficulty for {currentTenant?.name || ''}</p>
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="neu-input px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="DSA">DSA</option>
              <option value="System Design">System Design</option>
              <option value="DBMS">DBMS</option>
              <option value="OS & Networking">OS & Networking</option>
              <option value="General Technical">General Technical</option>
            </select>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="neu-btn-primary text-xs font-bold px-3 py-2"
            >
              {showAddForm ? 'Close Form' : '+ Add Question'}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 neu-card bg-rose-50 text-rose-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleCreateQuestion} className="p-4 neu-card bg-slate-50 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-700">Add Technical Interview Question</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                  className="w-full neu-input p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="DSA">DSA</option>
                  <option value="System Design">System Design</option>
                  <option value="DBMS">DBMS</option>
                  <option value="OS & Networking">OS & Networking</option>
                  <option value="General Technical">General Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Difficulty</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="w-full neu-input p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Question Prompt</label>
              <textarea
                required
                rows={2}
                value={newQuestion.q}
                onChange={(e) => setNewQuestion({ ...newQuestion, q: e.target.value })}
                placeholder="Enter technical question prompt..."
                className="w-full neu-input p-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <button type="submit" className="neu-btn-primary text-xs font-bold px-4 py-2">
              Save Question to DB
            </button>
          </form>
        )}

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 neu-card">
              No questions found in database for {currentTenant?.name}. Click "+ Add Question" above to create one.
            </div>
          ) : (
            filtered.map(item => (
              <div key={item._id || item.id} className="p-4 neu-card space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="neu-chip-active text-[10px] py-0.5 px-2">{item.category}</span>
                    <span className="text-xs font-bold text-purple-700">{item.difficulty || 'Medium'}</span>
                  </div>
                  {item._id && (
                    <button
                      onClick={() => handleDeleteQuestion(item._id)}
                      className="text-[10px] text-rose-600 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 mt-1">{item.q}</h4>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EvaluatorQuestionBankPage;


