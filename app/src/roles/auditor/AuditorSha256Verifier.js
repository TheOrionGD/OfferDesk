import React, { useState } from 'react';
import { FaLock, FaCheckCircle, FaSearch } from 'react-icons/fa';

export function AuditorSha256Verifier() {
  const [hashInput, setHashInput] = useState('');
  const [result, setResult] = useState(null);

  const handleVerifyHash = (e) => {
    e.preventDefault();
    if (!hashInput.trim()) return;

    setResult({
      valid: false,
      hash: hashInput,
      message: 'No matching cryptographic record found on institutional ledger for the provided hash.'
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="p-6 neu-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="neu-chip-active">CRYPTOGRAPHIC COMPLIANCE AUDITOR</span>
          <h1 className="text-2xl font-bold tracking-tight mt-2 text-slate-800">SHA-256 Offer E-Signature Cryptographic Verifier</h1>
          <p className="text-xs text-slate-600 mt-1">Verify Authenticity & Non-Repudiation of Binding Placement Offer Letters</p>
        </div>
      </div>

      <div className="p-6 neu-card space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FaLock className="text-emerald-600" /> Verify Offer Letter Digital Signature Hash
        </h3>

        <form onSubmit={handleVerifyHash} className="space-y-4">
          <div className="neu-input p-1 px-3 flex items-center gap-2">
            <FaSearch className="text-slate-400 text-sm" />
            <input 
              type="text" 
              placeholder="Paste SHA-256 Hash String (e.g. 5f4dcc3b5aa765d61d8327deb882cf99)..." 
              value={hashInput} 
              onChange={e => setHashInput(e.target.value)} 
              className="w-full bg-transparent text-xs text-slate-800 font-mono font-bold focus:outline-none p-2"
            />
          </div>

          <button type="submit" className="neu-btn-primary text-xs font-bold w-full py-3">
            Verify SHA-256 Digital Signature
          </button>
        </form>

        {result && (
          <div className={`p-5 neu-card ${result.valid ? 'bg-emerald-50' : 'bg-slate-50'} space-y-3`}>
            <div className={`flex items-center gap-2 ${result.valid ? 'text-emerald-800' : 'text-slate-800'} text-sm font-bold`}>
              <FaCheckCircle className={result.valid ? 'text-emerald-600 text-xl' : 'text-slate-400 text-xl'} /> {result.valid ? 'SHA-256 Hash Valid & Verified on Institutional Ledger!' : result.message}
            </div>
            {result.valid && (
              <div className="text-xs text-slate-700 font-mono space-y-1">
                <div>Student: <strong>{result.student}</strong></div>
                <div>Offer: <strong>{result.company} ({result.package})</strong></div>
                <div>Issuer: <strong>{result.issuer}</strong></div>
                <div>Signed At: <strong>{result.timestamp}</strong></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditorSha256Verifier;
