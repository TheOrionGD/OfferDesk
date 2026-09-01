import React, { useState, useEffect } from 'react';
import { FaLungs, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { CapacitorService } from '../../../services/capacitorService';

function MindfulBreathingGuide() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('Inhale deeply...');
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval;
    if (active && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
        const rem = timer % 12;
        if (rem > 8) {
          setPhase('Inhale deeply...');
          CapacitorService.triggerHapticPulse();
        } else if (rem > 4) {
          setPhase('Hold breath gently...');
        } else {
          setPhase('Exhale slowly...');
        }
      }, 1000);
    } else if (timer === 0) {
      setActive(false);
      setPhase('Exercise Complete! Mind Calmed.');
    }
    return () => clearInterval(interval);
  }, [active, timer]);

  const toggleExercise = () => {
    CapacitorService.triggerHapticPulse();
    setActive(!active);
  };

  const resetExercise = () => {
    setActive(false);
    setTimer(120);
    setPhase('Inhale deeply...');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-slate-900/90 text-white shadow-xl text-center">
      <div className="flex justify-center items-center gap-3 mb-3">
        <div className="p-3 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
          <FaLungs className="text-2xl" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">Pre-Interview 2-Minute Mindful Breathing Guide</h3>
      </div>
      <p className="text-xs text-gray-400 mb-6">Calm pre-interview nerves with haptic rhythmic breathing</p>

      <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full bg-cyan-500/20 ${active ? 'animate-ping' : ''}`} />
        <div className={`w-32 h-32 rounded-full border-4 border-cyan-400 flex flex-col items-center justify-center bg-slate-800/90 transition-all duration-1000 ${phase.includes('Inhale') ? 'scale-110 border-emerald-400' : 'scale-95 border-cyan-400'}`}>
          <span className="text-xl font-bold font-mono text-cyan-300">{formatTime(timer)}</span>
          <span className="text-[10px] text-gray-300 mt-1 uppercase font-semibold">{phase.split(' ')[0]}</span>
        </div>
      </div>

      <p className="text-sm font-bold text-cyan-300 mb-6">{phase}</p>

      <div className="flex justify-center gap-3">
        <button 
          onClick={toggleExercise}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-md"
        >
          {active ? <><FaPause /> Pause</> : <><FaPlay /> Start 2-Min Routine</>}
        </button>
        <button 
          onClick={resetExercise}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 font-bold text-xs text-gray-300 rounded-lg transition-all flex items-center gap-2"
        >
          <FaRedo /> Reset
        </button>
      </div>
    </div>
  );
}

export default MindfulBreathingGuide;
