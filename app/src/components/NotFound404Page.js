import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export function NotFound404Page() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-6 neu-card max-w-md w-full space-y-4">
        <div className="p-4 bg-amber-100 border border-amber-300 text-amber-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <FaExclamationTriangle className="text-3xl" />
        </div>

        <span className="neu-chip-inactive text-amber-800 border-amber-300 font-mono text-xs">
          HTTP 404 • PAGE NOT FOUND
        </span>

        <h1 className="text-2xl font-extrabold text-slate-800">Resource Unavailable</h1>
        <p className="text-xs text-slate-600">
          The requested page route or resource does not exist on this campus placement server.
        </p>

        <div className="pt-2">
          <button 
            onClick={() => navigate('/')} 
            className="neu-btn-primary text-xs font-bold w-full py-3 flex items-center justify-center gap-2"
          >
            <FaHome /> Return to Home Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound404Page;
