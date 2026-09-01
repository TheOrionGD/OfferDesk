import React, { useState } from "react";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export function EvaluatorScratchpadPage() {
  const [notes, setNotes] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4 max-w-2xl">
        <span className="neu-chip-active">PAGE 6 OF 10 • PANELIST SCRATCHPAD</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Live Evaluation Code & Concept Scratchpad</h1>
        <p className="text-xs text-slate-500">Private panelist notepad during live candidate interviews</p>

        {savedMsg && (
          <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> Scratchpad notes saved locally!
          </div>
        )}

        <textarea 
          rows={10}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full neu-input p-4 text-xs font-mono text-slate-800 focus:outline-none"
        />

        <button onClick={handleSave} className="neu-btn-primary text-xs font-bold flex items-center gap-2">
          <FaSave /> Save Panelist Scratchpad Notes
        </button>
      </div>
    </div>
  );
}

export default EvaluatorScratchpadPage;
