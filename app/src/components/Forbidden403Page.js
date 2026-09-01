import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBan, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export function Forbidden403Page() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-6 neu-card max-w-md w-full space-y-4">
        <div className="p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <FaBan className="text-3xl" />
        </div>

        <span className="neu-chip-inactive text-rose-800 border-rose-300 font-mono text-xs">
          HTTP 403 • ACCESS FORBIDDEN
        </span>

        <h1 className="text-2xl font-extrabold text-slate-800">Role Privilege Restricted</h1>
        <p className="text-xs text-slate-600">
          User <strong>{user?.name || user?.email || ''}</strong> ({user?.role || 'Guest'}) does not have administrative permissions to view this resource.
        </p>

        <div className="pt-2">
          <button 
            onClick={() => navigate('/')} 
            className="neu-btn-primary text-xs font-bold w-full py-3 flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Return to Authorized Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forbidden403Page;
