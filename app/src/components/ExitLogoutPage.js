import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';

export function ExitLogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-6 neu-card max-w-md w-full space-y-4">
        <div className="p-4 bg-slate-200 border border-slate-300 text-slate-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <FaSignOutAlt className="text-3xl text-emerald-600" />
        </div>

        <span className="neu-chip-active text-xs">
          SECURE SESSION TERMINATION
        </span>

        <h1 className="text-xl font-bold text-slate-800">Signing Out of Campus Portal</h1>
        <p className="text-xs text-slate-600">
          Clearing local JWT session tokens & securing multi-tenant authentication cache...
        </p>

        <div className="p-3 neu-card bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
          <FaCheckCircle className="text-emerald-600" /> Redirecting to Login Page...
        </div>
      </div>
    </div>
  );
}

export default ExitLogoutPage;
