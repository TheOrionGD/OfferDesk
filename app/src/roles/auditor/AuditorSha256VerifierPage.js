import React from 'react';
import AuditorSha256Verifier from './AuditorSha256Verifier';

export function AuditorSha256VerifierPage() {
  return (
    <div className="space-y-4">
      <div className="p-4 neu-card flex justify-between items-center">
        <span className="neu-chip-active">PAGE 2 OF 10 • SHA-256 OFFER LETTER HASH VERIFIER</span>
        <span className="text-xs text-slate-500 font-bold">Cryptographic Offer Authenticity Audit</span>
      </div>
      <AuditorSha256Verifier />
    </div>
  );
}

export default AuditorSha256VerifierPage;
