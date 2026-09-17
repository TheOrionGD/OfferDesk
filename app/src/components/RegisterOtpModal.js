import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaShieldAlt, FaPaperPlane, FaKey, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

function RegisterOtpModal({ isOpen, onClose, onVerified }) {
  const { sendOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [domainError, setDomainError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setDomainError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await sendOtp(email);
      if (data && data.success) {
        if (data.otpCodeSimulated) {
          setSimulatedOtp(data.otpCodeSimulated);
        }
        setSuccessMsg(`✅ OTP sent to ${email} (via Brevo Transactional Mailer).`);
        setStep(2);
      }
    } catch (err) {
      setDomainError(err.message || 'Failed to dispatch OTP email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setDomainError('');
    setLoading(true);

    try {
      const user = await verifyOtp(email, otpCode, department);
      if (user) {
        setSuccessMsg(`🎉 Identity Verified! Assigned to ${user.department} (Academic Year ${user.academicYear}).`);
        setTimeout(() => {
          if (onVerified) onVerified(user);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setDomainError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
        >
          <FaTimes />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
          <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-emerald-400">
            <FaShieldAlt className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Institution Domain Guard & Brevo OTP</h3>
            <p className="text-xs text-gray-400">Strict Official University Email Verification</p>
          </div>
        </div>

        {domainError && (
          <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold mb-4 flex items-start gap-2">
            <FaExclamationTriangle className="text-rose-400 text-base shrink-0 mt-0.5" />
            <div>{domainError}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-600 text-emerald-200 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400 text-base shrink-0" />
            <div>{successMsg}</div>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Official Student / Staff Email</label>
              <input 
                type="email" 
                required
                placeholder="student@university.ac.in (No @gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ℹ️ Personal domains like <strong>@gmail.com</strong> are strictly blocked. Email must match a registered tenant (e.g. <code>@university.ac.in</code>).
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <FaPaperPlane /> {loading ? 'Dispatching OTP...' : 'Send Brevo OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {simulatedOtp && (
              <div className="p-2.5 bg-slate-800 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 font-mono">
                🔑 Brevo Simulated OTP: <strong>{simulatedOtp}</strong>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Select / Enter Academic Department</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Computer Science & Engineering, AI & Data Science, ECE, EEE, Mechanical"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-800 border border-gray-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 mb-3"
              />

              <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Enter 6-Digit OTP Code</label>
              <input 
                type="text" 
                required
                maxLength="6"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-slate-800 border border-gray-700 rounded-lg p-3 text-center text-lg tracking-widest font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs font-semibold"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FaKey /> {loading ? 'Verifying...' : 'Verify OTP & Log In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterOtpModal;
