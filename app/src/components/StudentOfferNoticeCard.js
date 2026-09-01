import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, Stack, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider } from '@mui/material';
import { CheckCircle, Cancel, Timer, ArrowBack, ReportProblem, Send } from '@mui/icons-material';
import { greenPalette } from '../theme';
import { CapacitorService } from '../services/capacitorService';

export function StudentOfferNoticeCard({ 
  contract, 
  onAccept, 
  onReject, 
  onBack 
}) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [signature, setSignature] = useState('');
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Countdown timer for predefined duration (48 hours from creation)
  useEffect(() => {
    if (!contract?.expiresAt) return;
    const calculateTime = () => {
      const diff = new Date(contract.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('EXPIRED');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [contract]);

  if (!contract) return null;

  const isAccepted = contract.status === 'ACCEPTED' || contract.status === 'VERIFIED_AND_ACCEPTED';
  const isRejected = contract.status === 'REJECTED';
  const isExpired = timeLeft === 'EXPIRED';

  const handleApproveSubmit = async () => {
    if (!signature.trim()) {
      alert('Please type your legal signature name.');
      return;
    }
    const bioResult = await CapacitorService.verifyBiometricOrPasscode(
      `Authorize digital e-signature for ${contract.jobTitle} at ${contract.company}`
    );
    if (!bioResult.success) {
      alert('Biometric / Passcode authentication failed.');
      return;
    }
    setSignModalOpen(false);
    if (onAccept) {
      onAccept({
        contractId: contract.acceptanceId || contract.id,
        digitalSignature: signature
      });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      alert('Please state a valid reason for rejecting this offer.');
      return;
    }
    setRejectModalOpen(false);
    if (onReject) {
      onReject({
        contractId: contract.acceptanceId || contract.id,
        rejectionReason: rejectReason,
        rejectedAt: new Date().toISOString()
      });
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: '24px',
        bgcolor: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid var(--border-emerald-glow)',
        color: '#ffffff',
        mb: 3
      }}
    >
      {/* Top Header & Back Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Button
          size="small"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ color: '#94a3b8', fontWeight: 700 }}
        >
          Back to Circulars
        </Button>

        <Chip
          icon={<Timer sx={{ color: isExpired ? '#ef4444 !important' : '#f59e0b !important' }} />}
          label={isExpired ? '48h Deadline Expired' : `Valid Until: ${timeLeft}`}
          color={isExpired ? 'error' : 'warning'}
          variant="outlined"
          sx={{ fontWeight: 800, fontSize: '0.75rem' }}
        />
      </Stack>

      {/* Subject Line */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <Chip label="OFFICIAL PLACEMENT CONTRACT" color="primary" size="small" sx={{ fontWeight: 800 }} />
          <Chip label={`Space: ${contract.spaceName || 'HOD Space'}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 700 }} />
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 900, color: greenPalette.A200, mt: 1 }}>
          Subject: Offer E-Signature Contract for {contract.jobTitle || 'Role'} at {contract.company}
        </Typography>

        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
          Issued by Placement Cell Officer via HOD Space: <strong>{contract.spaceName || 'HOD Placement Space'}</strong> (HOD: {contract.hodName || 'Faculty HOD'})
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Short Description */}
      <Box sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
          Offer Overview & Short Description:
        </Typography>
        <Stack spacing={1} sx={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          <div><strong>Company Partner:</strong> {contract.company}</div>
          <div><strong>Role / Title:</strong> {contract.jobTitle}</div>
          <div><strong>Package CTC:</strong> <span style={{ color: greenPalette.A200, fontWeight: 700 }}>{contract.salary || 'Standard Package'}</span></div>
          <div><strong>Binding Policy:</strong> {contract.policyTerms || 'By signing, candidate agrees to single-offer placement cell regulations.'}</div>
        </Stack>
      </Box>

      {/* Current Status Alert */}
      {isAccepted && (
        <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ borderRadius: '16px', mb: 2, fontWeight: 700 }}>
          🎉 You have ACCEPTED this offer. Digital SHA-256 e-signature verified.
        </Alert>
      )}

      {isRejected && (
        <Alert severity="error" icon={<ReportProblem fontSize="inherit" />} sx={{ borderRadius: '16px', mb: 2, fontWeight: 700 }}>
          ❌ You REJECTED this offer. Rejection reason has been automatically transmitted to your assigned Mentor & HOD for counseling.
        </Alert>
      )}

      {/* Action Buttons: Approve & Reject */}
      {!isAccepted && !isRejected && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={isExpired}
            startIcon={<CheckCircle />}
            onClick={() => setSignModalOpen(true)}
            sx={{
              py: 1.4,
              borderRadius: '14px',
              fontWeight: 900,
              bgcolor: greenPalette.A700,
              color: '#ffffff',
              '&:hover': { bgcolor: greenPalette[800] }
            }}
          >
            APPROVE OFFER (AFFIX E-SIGNATURE)
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            disabled={isExpired}
            startIcon={<Cancel />}
            onClick={() => setRejectModalOpen(true)}
            sx={{
              py: 1.4,
              borderRadius: '14px',
              fontWeight: 900,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            REJECT OFFER (PROVIDE REASON)
          </Button>
        </Stack>
      )}

      {/* APPROVE SIGNATURE MODAL */}
      <Dialog open={signModalOpen} onClose={() => setSignModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0f172a', color: '#ffffff', fontWeight: 800 }}>
          Affix Legal E-Signature
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#0f172a', pt: 2 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, display: 'block' }}>
            Type your full legal name. Biometric / phone passcode check will be requested.
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Your Legal Signature Name..."
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            sx={{ bgcolor: 'rgba(30, 41, 59, 0.9)', input: { color: '#ffffff' } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', p: 2 }}>
          <Button onClick={() => setSignModalOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleApproveSubmit} variant="contained" sx={{ bgcolor: greenPalette.A700 }}>
            Sign & Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* REJECT OFFER MODAL (Transmits Reason to Mentor) */}
      <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0f172a', color: '#ef4444', fontWeight: 800 }}>
          Reject Offer Letter & Notify Mentor
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#0f172a', pt: 2 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, display: 'block' }}>
            State a valid reason for rejecting this offer. Your reason will be automatically sent to your assigned Mentor for mandatory counselling.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            required
            placeholder="Specify valid reason (e.g. Higher Studies, Opposing Domain Focus, Personal Reasons)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ bgcolor: 'rgba(30, 41, 59, 0.9)', textarea: { color: '#ffffff' } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', p: 2 }}>
          <Button onClick={() => setRejectModalOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleRejectSubmit} variant="contained" color="error" startIcon={<Send />}>
            Transmit Rejection to Mentor
          </Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
}

export default StudentOfferNoticeCard;
