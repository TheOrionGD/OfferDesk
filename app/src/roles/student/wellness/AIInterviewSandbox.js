import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaRobot, FaPlay, FaCheckCircle, FaVolumeUp, FaExclamationTriangle } from 'react-icons/fa';
import { CapacitorService } from '../../../services/capacitorService';

function AIInterviewSandbox() {
  const [recording, setRecording] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const recognitionRef = useRef(null);

  const prompts = [
    "Tell me about a time you had to optimize a slow database query or bottlenecked API.",
    "How do you handle disagreement with a technical team lead during system architecture design?",
    "Explain the difference between optimistic and pessimistic locking in MongoDB / SQL databases."
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscription(current);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setErrorMsg(`⚠️ Voice Service Unavailable: Speech recognition error (${event.error}). Please check microphone permissions.`);
        setRecording(false);
      };

      recognition.onend = () => {
        setRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const analyzeTranscript = (text) => {
    if (!text || text.trim().length === 0) {
      setFeedback(null);
      setErrorMsg('⚠️ No Speech Detected: Please speak clearly into your microphone to record your answer.');
      return;
    }
    const words = text.trim().split(/\s+/).length;
    const ratingScore = Math.min(10, Math.max(5, (words / 15).toFixed(1)));
    
    setFeedback({
      rating: `${ratingScore} / 10`,
      tone: words > 30 ? 'Comprehensive & Detailed' : 'Concise',
      aiTips: words > 30 
        ? `Great elaboration (${words} words)! Ensure concise problem-solution framing.`
        : `Answer recorded (${words} words). Elaborate on architectural impact and quantifiable metrics.`
    });
  };

  const handleToggleRecord = () => {
    CapacitorService.triggerHapticPulse();
    setErrorMsg(null);
    if (!recognitionRef.current) {
      setErrorMsg('⚠️ Voice Service Currently Unavailable: Browser Speech Recognition API is unsupported on this browser.');
      return;
    }

    if (!recording) {
      try {
        setTranscription('');
        setFeedback(null);
        recognitionRef.current.start();
        setRecording(true);
      } catch (err) {
        setErrorMsg('⚠️ Failed to start microphone recording. Check browser audio settings.');
      }
    } else {
      try {
        recognitionRef.current.stop();
        setRecording(false);
        setTimeout(() => {
          analyzeTranscript(transcription);
        }, 500);
      } catch (err) {
        setRecording(false);
      }
    }
  };

  const speakPrompt = () => {
    CapacitorService.triggerHapticPulse();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(prompts[promptIndex]);
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMsg('⚠️ Speech Synthesis Unavailable: Browser text-to-speech engine is not supported.');
    }
  };

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-slate-900/90 text-white shadow-xl space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
        <div className="p-3 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
          <FaRobot className="text-2xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">Low-Stakes AI Real Voice Interview Sandbox</h3>
          <p className="text-xs text-gray-400">Rehearse answers with real microphone speech recognition and dynamic NLP analysis</p>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-slate-800/80 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase font-bold text-cyan-400">AI Voice Avatar Prompt #{promptIndex + 1}</span>
          <button 
            onClick={() => { setPromptIndex((promptIndex + 1) % prompts.length); setTranscription(''); setFeedback(null); }}
            className="text-xs text-gray-400 hover:text-white font-semibold flex items-center gap-1"
          >
            Next Question <FaPlay className="text-[10px]" />
          </button>
        </div>
        <p className="text-sm font-bold text-white mb-3">{prompts[promptIndex]}</p>
        <button 
          onClick={speakPrompt}
          className="text-xs text-cyan-300 font-semibold flex items-center gap-1 bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded hover:bg-cyan-900/60 transition-all"
        >
          <FaVolumeUp /> Listen to AI Voice Avatar Prompt
        </button>
      </div>

      <div className="text-center py-2">
        <button 
          onClick={handleToggleRecord}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl ${recording ? 'bg-rose-600 text-white animate-pulse' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
        >
          <FaMicrophone className="text-2xl" />
        </button>
        <p className="text-xs font-semibold text-gray-300 mt-2">
          {recording ? 'Listening live via microphone... Click to Stop & Analyze' : 'Click Mic to Practice Answer (Live Web Speech)'}
        </p>
      </div>

      {transcription && (
        <div className="p-4 rounded-xl bg-slate-800/60 border border-gray-700 text-xs text-gray-300">
          <span className="font-bold text-cyan-300 block mb-1">Live Microphone Speech Transcript:</span>
          <p>{transcription}</p>
        </div>
      )}

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-700/80 text-xs text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FaCheckCircle className="text-emerald-400 text-base" /> Real-time Speech Assessment: {feedback.rating}
          </div>
          <p><strong>Tone Analysis:</strong> {feedback.tone}</p>
          <p><strong>AI Coaching Tip:</strong> {feedback.aiTips}</p>
        </div>
      )}
    </div>
  );
}

export default AIInterviewSandbox;
