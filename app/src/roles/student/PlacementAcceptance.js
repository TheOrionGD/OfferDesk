import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, Box, Button, TextField, Chip, Stack, Card, CardContent, Alert, Divider } from '@mui/material';
import { CheckCircle, Timer, Edit, Security, Warning, Gavel } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { greenPalette } from '../../theme';
import { CapacitorService } from '../../services/capacitorService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function PlacementAcceptance() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [signingId, setSigningId] = useState(null);
  const [msg, setMsg] = useState(null);

  const fetchContracts = async () => {
    if (!user?._id || !currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/acceptances/student/${user._id}?tenantId=${currentTenant.tenantId}`);
      const data = await res.json();
      if (data.success) {
        setContracts(data.contracts || []);
      }
    } catch (err) {
      console.error("Fetch contracts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user, currentTenant]);

  const handleSignContract = async (acceptanceId) => {
    if (!signature.trim()) {
      setMsg({ type: 'error', text: 'Please type your full legal digital signature.' });
      return;
    }

    // Require Native Device Biometric (Fingerprint/FaceID/Passcode) Verification
    const authResult = await CapacitorService.verifyBiometricOrPasscode(
      `Authorize digital e-signature for Placement Contract as ${user?.name || 'Student'}`
    );

    if (!authResult.success) {
      setMsg({ type: 'error', text: 'Biometric / Phone Passcode verification failed or canceled.' });
      return;
    }

    setSigningId(acceptanceId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/acceptances/${acceptanceId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          digitalSignature: signature,
          tenantId: currentTenant?.tenantId,
          studentId: user?._id || user?.id,
          signedBy: user?.name,
          signedByRole: user?.role
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: data.message });
        setSignature('');
        fetchContracts();
      } else {
        setMsg({ type: 'error', text: data.error || '' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSigningId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-emerald-glow)' }}>
        
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette[300] }}>
            <Gavel sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>
              Digital Placement Offer & Contract Acceptance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review institutional placement agreements, sign digitally within the strict 48-hour deadline, and generate SHA-256 cryptographic verification hashes.
            </Typography>
          </Box>
        </Stack>

        {msg && (
          <Alert severity={msg.type === 'success' ? 'success' : 'error'} sx={{ mb: 3, borderRadius: 2 }}>
            {msg.text}
          </Alert>
        )}

        {contracts.length === 0 ? (
          <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px dashed var(--border-subtle)', p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: greenPalette[400], mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
              No Pending Placement Contracts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have no active placement offer letters or policy contracts awaiting e-signature.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {contracts.map((c) => {
              const isAccepted = c.status === 'ACCEPTED';
              const isOverdue = c.status === 'OVERDUE_UNACCEPTED';
              const expiresDate = new Date(c.expiresAt).toLocaleString();

              return (
                <Grid item xs={12} key={c.acceptanceId}>
                  <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: `1px solid ${isAccepted ? greenPalette[600] : (isOverdue ? '#f43f5e' : greenPalette[500])}` }}>
                    <CardContent>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Chip label={c.company} color="primary" size="small" sx={{ fontWeight: 700 }} />
                            <Chip 
                              icon={isAccepted ? <CheckCircle /> : (isOverdue ? <Warning /> : <Timer />)} 
                              label={isAccepted ? "Digital Signature Verified" : (isOverdue ? "48h Deadline Expired" : "48h E-Signature Window Active")} 
                              color={isAccepted ? "success" : (isOverdue ? "error" : "warning")}
                              variant="outlined"
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                          </Stack>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff' }}>
                            {c.jobTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Contract Issued: {new Date(c.createdAt).toLocaleDateString()} • Deadline: <strong style={{ color: isOverdue ? '#f43f5e' : greenPalette.A200 }}>{expiresDate}</strong>
                          </Typography>
                          <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(76, 175, 80, 0.08)', borderRadius: 1.5, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: greenPalette.A200, fontWeight: 700 }}>
                              🏛️ Created & Issued Exclusively by Placement Cell Officer via HOD Space: <strong>{c.spaceName || 'HOD Placement Space'}</strong> (HOD: {c.hodName || 'Department HOD'})
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 2, borderColor: 'var(--border-subtle)' }} />

                      {/* Contract Terms Box */}
                      <Box sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', borderRadius: 2, border: '1px solid var(--border-subtle)', mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: greenPalette[300], mb: 1 }}>
                          Placement Cell Policy Agreement Terms:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.85rem' }}>
                          By affixing your digital signature below, you confirm acceptance of the placement offer for <strong>{c.jobTitle}</strong> at <strong>{c.company}</strong> in accordance with {currentTenant.name}'s Training & Placement Cell policies. Acceptance is legally binding and barring exceptional circumstances, prohibits appearing for further conflicting campus recruitment drives.
                        </Typography>
                      </Box>

                      {isAccepted ? (
                        <Box sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: `1px solid ${greenPalette[600]}` }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Security sx={{ color: greenPalette.A400 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: greenPalette.A200 }}>
                              Cryptographic SHA-256 Hash Generated & Timestamped
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'var(--text-secondary)', display: 'block', mt: 0.5 }}>
                            Signature: "{c.digitalSignature}" • Hash: {c.signatureHash}
                          </Typography>
                        </Box>
                      ) : isOverdue ? (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          ⚠️ 48-Hour Deadline Expired. Your assigned Faculty Mentor & HOD have received an urgent alert for counselling intervention.
                        </Alert>
                      ) : (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Type your full legal name to generate SHA-256 e-signature..."
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 1.5, input: { color: '#ffffff' } }}
                          />
                          <Button
                            variant="contained"
                            onClick={() => handleSignContract(c.acceptanceId)}
                            disabled={signingId === c.acceptanceId}
                            startIcon={<Edit />}
                            sx={{ bgcolor: greenPalette[500], '&:hover': { bgcolor: greenPalette[600] }, fontWeight: 700, px: 4, py: 1, whitespace: 'nowrap' }}
                          >
                            Affix E-Signature
                          </Button>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

      </Paper>
    </Container>
  );
}

export default PlacementAcceptance;
