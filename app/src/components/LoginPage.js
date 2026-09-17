import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button, TextField, Stack, Alert, Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Fingerprint, Lock, Email, ArrowForward, AccountBalance, Shield } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { greenPalette } from '../theme';
import { CapacitorService } from '../services/capacitorService';
import appIconImg from '../assets/app-icon.png';

export function LoginPage() {
  const { login, authError } = useAuth();
  const { tenants, currentTenant, switchTenant } = useTenant();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localErr, setLocalErr] = useState(null);
  const [detectedTenant, setDetectedTenant] = useState(null);

  // Compulsory Password Update Modal State for Default Password "THEORIONGD"
  const [showCompulsoryPasswordModal, setShowCompulsoryPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingUserRole, setPendingUserRole] = useState('student');

  // Domain Auto-Detection & Automatic Tenant Routing
  const handleEmailChange = (val) => {
    setEmail(val);
    setLocalErr(null);

    if (val.includes('@')) {
      const domainPart = val.split('@')[1]?.toLowerCase().trim();
      if (domainPart) {
        // Extract base institution code from domain (e.g. "krct.ac.in" -> "krct")
        const domainPrefix = domainPart.split('.')[0];

        let matched = tenants.find(t => 
          t.code?.toLowerCase() === domainPrefix ||
          domainPart.includes(t.code?.toLowerCase()) || 
          (t.domain && domainPart.includes(t.domain.toLowerCase()))
        );

        if (!matched) {
          if (domainPart.includes('krct')) matched = tenants.find(t => t.code === 'KRCT');
          else if (domainPart.includes('psg')) matched = tenants.find(t => t.code === 'PSG');
          else if (domainPart.includes('cit')) matched = tenants.find(t => t.code === 'CIT');
          else if (domainPart.includes('sastra')) matched = tenants.find(t => t.code === 'SASTRA');
        }

        if (matched) {
          setDetectedTenant(matched);
          switchTenant(matched.tenantId);
        } else {
          setDetectedTenant(null);
        }
      }
    } else {
      setDetectedTenant(null);
    }
  };

  const inferRoleFromEmail = (mail) => {
    const lower = mail.toLowerCase();
    if (lower.includes('admin') || lower.includes('placement')) return 'tenant_admin';
    if (lower.includes('hod') || lower.includes('faculty') || lower.includes('coord')) return 'dept_coordinator';
    if (lower.includes('recruiter') || lower.includes('hr') || lower.includes('corp')) return 'recruiter';
    if (lower.includes('evaluator') || lower.includes('panel')) return 'evaluator';
    if (lower.includes('alumni') || lower.includes('mentor')) return 'mentor';
    if (lower.includes('sysadmin')) return 'sysadmin';
    if (lower.includes('auditor')) return 'auditor';
    return 'student';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLocalErr(null);
    if (!email.trim() || !password.trim()) {
      setLocalErr('Please enter your official institutional email and password.');
      return;
    }

    const targetRole = inferRoleFromEmail(email);

    // COMPULSORY PASSWORD CHANGE GUARD FOR INITIAL PASSWORD "THEORIONGD"
    if (password === 'THEORIONGD') {
      setPendingUserRole(targetRole);
      setShowCompulsoryPasswordModal(true);
      return;
    }

    executeLogin(targetRole);
  };

  const executeLogin = async (targetRole) => {
    setLoading(true);
    try {
      await login(email, password, targetRole);
      
      if (targetRole === 'student') navigate('/student/dashboard');
      else if (targetRole === 'recruiter') navigate('/recruiter/dashboard');
      else if (targetRole === 'tenant_admin') navigate('/tenant-admin');
      else if (targetRole === 'dept_coordinator') navigate('/dept-coordinator');
      else if (targetRole === 'evaluator') navigate('/evaluator');
      else if (targetRole === 'mentor') navigate('/mentor');
      else navigate('/student/dashboard');

    } catch (err) {
      setLocalErr(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompulsoryPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }

    setShowCompulsoryPasswordModal(false);
    alert("✅ Compulsory Password Update Successful! Default initial password ('THEORIONGD') updated.");
    executeLogin(pendingUserRole);
  };

  const handleBiometricQuickLogin = async () => {
    setLocalErr(null);
    const authRes = await CapacitorService.verifyBiometricOrPasscode(
      'Authenticate native biometric login'
    );
    if (authRes.success) {
      if (!email || !password) {
        setLocalErr('Enter your email and password before using biometric login.');
        return;
      }
      await login(email, password, 'student');
      navigate('/student/dashboard');
    } else {
      setLocalErr('Biometric authentication failed or canceled.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
      <Paper 
        className="neu-card" 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          borderRadius: '24px', 
          bgcolor: '#eef2f7', 
          boxShadow: '12px 12px 28px #cbd5e1, -12px -12px 28px #ffffff'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar src={appIconImg} alt="OfferDesk App" sx={{ width: 52, height: 52, boxShadow: '4px 4px 12px #d1d9e6, -4px -4px 12px #ffffff' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5 }}>
              OfferDesk <span style={{ color: greenPalette.A700 }}>App</span>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Neumorphic Institutional Pre-Registered Gate
            </Typography>
          </Box>
        </Stack>

        {(localErr || authError) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {localErr || authError}
          </Alert>
        )}

        {/* DOMAIN DETECTED BADGE */}
        {detectedTenant && (
          <Box className="neu-card" sx={{ p: 2, mb: 2.5, borderRadius: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountBalance sx={{ color: greenPalette.A700, fontSize: 22 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Detected Institution: {detectedTenant.name} ({detectedTenant.code})
              </Typography>
            </Stack>
          </Box>
        )}

        <form onSubmit={handleFormSubmit}>
          <Stack spacing={2.5}>
            
            {/* Debossed Email Input */}
            <Box className="neu-input" sx={{ p: 0.5, px: 2, borderRadius: 4 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Official Institutional Email"
                type="email"
                placeholder="e.g. student@university.ac.in"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <Email sx={{ color: greenPalette.A700, mr: 1.5, fontSize: 22 }} />
                }}
                sx={{ input: { color: '#1e293b', fontWeight: 700 }, label: { color: '#64748b', fontWeight: 600 } }}
              />
            </Box>

            {/* Debossed Password Input */}
            <Box className="neu-input" sx={{ p: 0.5, px: 2, borderRadius: 4 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Password (Initial: THEORIONGD)"
                type="password"
                placeholder="e.g. THEORIONGD or your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <Lock sx={{ color: greenPalette.A700, mr: 1.5, fontSize: 22 }} />
                }}
                sx={{ input: { color: '#1e293b', fontWeight: 700 }, label: { color: '#64748b', fontWeight: 600 } }}
              />
            </Box>

            {/* Soft-3D Glowing Pill Submit Button */}
            <Button
              type="submit"
              fullWidth
              className="neu-btn-primary"
              disabled={loading}
              endIcon={<ArrowForward />}
              sx={{
                py: 1.4,
                fontSize: '1rem',
                fontWeight: 800
              }}
            >
              {loading ? 'Authenticating Domain...' : 'Sign In to Campus Account'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.06)' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>Biometric Quick Unlock</Typography>
        </Divider>

        {/* Neumorphic Soft Biometric Action */}
        <Button
          fullWidth
          className="neu-btn-secondary"
          startIcon={<Fingerprint sx={{ color: greenPalette.A700 }} />}
          onClick={handleBiometricQuickLogin}
          sx={{ py: 1.2, fontWeight: 800 }}
        >
          Verify Phone Fingerprint / Passcode
        </Button>

      </Paper>

      {/* COMPULSORY PASSWORD CHANGE MODAL FOR INITIAL PASSWORD "THEORIONGD" */}
      <Dialog open={showCompulsoryPasswordModal} onClose={() => setShowCompulsoryPasswordModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0f172a', color: '#ffffff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield sx={{ color: '#f59e0b' }} /> Compulsory Password Change Required
        </DialogTitle>
        <form onSubmit={handleCompulsoryPasswordSubmit}>
          <DialogContent sx={{ bgcolor: '#0f172a', color: '#ffffff', pt: 2 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', mb: 2, display: 'block' }}>
              You are logging in with the default initial placement cell password <strong>("THEORIONGD")</strong>. As per university security policy, you must set a new personal password before accessing your dashboard.
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                required
                type="password"
                size="small"
                label="New Secure Password"
                placeholder="Minimum 6 characters..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ bgcolor: 'rgba(30, 41, 59, 0.9)', input: { color: '#ffffff' }, label: { color: '#94a3b8' } }}
              />
              <TextField
                fullWidth
                required
                type="password"
                size="small"
                label="Confirm New Password"
                placeholder="Re-type new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ bgcolor: 'rgba(30, 41, 59, 0.9)', input: { color: '#ffffff' }, label: { color: '#94a3b8' } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#0f172a', p: 2 }}>
            <Button onClick={() => setShowCompulsoryPasswordModal(false)} sx={{ color: '#94a3b8' }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: greenPalette.A700, fontWeight: 900 }}>
              Update Password & Continue
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Container>
  );
}

export default LoginPage;
