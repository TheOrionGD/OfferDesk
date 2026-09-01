import React, { useState } from 'react';
import { 
  FaHeartbeat, 
  FaLungs, 
  FaCompass, 
  FaHandsHelping, 
  FaRobot
} from 'react-icons/fa';

import PlacementAnxietyIndex from './wellness/PlacementAnxietyIndex';
import AIInterviewSandbox from './wellness/AIInterviewSandbox';
import MindfulBreathingGuide from './wellness/MindfulBreathingGuide';
import PeerSupportWall from './wellness/PeerSupportWall';
import RejectionResilienceAI from './wellness/RejectionResilienceAI';

export function StudentWellnessSuite() {
  const [activeTab, setActiveTab] = useState('anxiety');

  const tabs = [
    { key: 'anxiety', label: 'Anxiety Index', icon: <FaHeartbeat /> },
    { key: 'breathing', label: 'Mindful Breathing', icon: <FaLungs /> },
    { key: 'sandbox', label: 'AI Voice Sandbox', icon: <FaRobot /> },
    { key: 'peer_wall', label: 'Peer Wall', icon: <FaHandsHelping /> },
    { key: 'resilience', label: 'Rejection Resilience AI', icon: <FaCompass /> }
  ];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">PLACEMENT WELLNESS SUITE</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">Student Mental Health & Placement Wellness</h1>
          <p className="text-xs text-slate-600 mt-1">Confidential Stress Relief, 4-7-8 Breathing, AI Voice Sandbox & Rejection Resilience Coach</p>
        </div>
      </div>

      {/* Wellness Suite Sub-Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === t.key ? 'neu-chip-active--student' : 'neu-chip-inactive'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Render Active Wellness Module */}
      <div className="pt-2">
        {activeTab === 'anxiety' && <PlacementAnxietyIndex />}
        {activeTab === 'breathing' && <MindfulBreathingGuide />}
        {activeTab === 'sandbox' && <AIInterviewSandbox />}
        {activeTab === 'peer_wall' && <PeerSupportWall />}
        {activeTab === 'resilience' && <RejectionResilienceAI />}
      </div>
    </div>
  );
}

export default StudentWellnessSuite;
