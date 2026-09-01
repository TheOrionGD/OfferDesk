import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { FaEnvelope, FaCheckCircle, FaKey, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

export function EmailVerificationPage() {
  const { user, verifyOtp } = useAuth();
  const { currentTenant } = useTenant();

  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      await verifyOtp(user?.email, otp, user?.department);
      setVerified(true);
    } catch (err) {
      setErrorMsg(err.message || '⚠️ Invalid OTP code entered. Check your Brevo email inbox.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-6 neu-card max-w-md w-full space-y-4">
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <FaEnvelope className="text-3xl" />
        </div>

        <span className="neu-chip-active text-xs">
          BREVO OTP EMAIL VERIFICATION
        </span>

        <h1 className="text-xl font-bold text-slate-800">Official Institution Email Guard</h1>
        <p className="text-xs text-slate-600">
          Verification code dispatched to <strong>{user?.email || 'your email'}</strong> for <strong>{currentTenant?.name || ''}</strong>
        </p>

        {verified ? (
          <div className="p-4 neu-card bg-emerald-50 border-emerald-300 text-emerald-800 space-y-2">
            <FaCheckCircle className="text-3xl text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold">Email Domain Successfully Verified!</h4>
            <p className="text-xs text-slate-600">Your campus placement account is activated.</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3 pt-2">
            {errorMsg && (
              <div className="p-3 neu-card bg-rose-50 text-rose-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div className="neu-input p-2 px-3 flex items-center gap-2">
              <FaKey className="text-slate-400" />
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter 6-digit OTP..."
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-transparent text-slate-800 font-mono font-bold text-center text-sm focus:outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="neu-btn-primary text-xs font-bold w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP Code'} <FaArrowRight />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmailVerificationPage;
