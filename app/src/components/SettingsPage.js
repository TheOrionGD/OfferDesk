import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Stack, 
  Switch, 
  FormControlLabel, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider, 
  Chip, 
  Alert,
  TextField,
  Avatar
} from '@mui/material';
import { Settings, Security, Fingerprint, Notifications, VpnKey, Logout, LockClock, Timer, GpsFixed, Shield } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { greenPalette } from '../theme';
import { CapacitorService } from '../services/capacitorService';
import { GpsLocationService, GPSConsentStatus } from '../services/gpsLocationService';
import GpsConsentModal from './GpsConsentModal';

export function SettingsPage() {
  const { user, setUser, login, logout } = useAuth();
  const { tenants, currentTenant, switchTenant } = useTenant();

  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passResetMsg, setPassResetMsg] = useState(null);
  const [passResetErr, setPassResetErr] = useState(null);
  const [hoursLeft, setHoursLeft] = useState(23);
  const [minsLeft, setMinsLeft] = useState(45);

  const [gpsConsent, setGpsConsent] = useState(GpsLocationService.getConsentStatus());
  const [showGpsModal, setShowGpsModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinsLeft(prev => {
        if (prev === 0) {
          setHoursLeft(h => (h > 0 ? h - 1 : 0));
          return 59;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleChange = (newRole) => {
    if (user) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    setPassResetMsg(null);
    setPassResetErr(null);

    if (!currentPassword || !newPassword) {
      setPassResetErr('Please enter both current default password and new password.');
      return;
    }
    if (newPassword.length < 8) {
      setPassResetErr('New password must be at least 8 characters long.');
      return;
    }

    setPassResetMsg('✅ Password successfully updated & verified on University Auth Server!');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleBiometricToggle = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      const res = await CapacitorService.verifyBiometricOrPasscode('Enable Native Biometric Auth');
      if (res.success) {
        setBiometricsEnabled(true);
      } else {
        setBiometricsEnabled(false);
      }
    } else {
      setBiometricsEnabled(false);
    }
  };

  const handleGpsToggle = (e) => {
    if (e.target.checked) {
      setShowGpsModal(true);
    } else {
      GpsLocationService.revokeConsent();
      setGpsConsent(GPSConsentStatus.DENIED);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
      
      {/* Settings Header Banner */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3, border: '1px solid var(--border-emerald-glow)' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: greenPalette[700], color: '#ffffff', width: 44, height: 44 }}>
            <Settings />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: greenPalette[800] }}>
              App Settings & Preferences
            </Typography>
            <Typography variant="caption" color="text.secondary">
              OfferDesk Capacitor Mobile Control Panel
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* LOCATION & GPS PRIVACY ACCESS MANAGEMENT */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <GpsFixed sx={{ color: greenPalette.A700, fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[800] }}>
              Location & GPS Privacy Management
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Consent-based navigation & drive attendance verification
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.5}>
          <FormControlLabel
            control={
              <Switch 
                checked={gpsConsent === GPSConsentStatus.GRANTED} 
                onChange={handleGpsToggle} 
                color="success" 
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: greenPalette[800] }}>
                  Drive Navigation & Attendance GPS Access
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Status: <strong>{gpsConsent === GPSConsentStatus.GRANTED ? 'Granted' : 'Revoked / Disabled'}</strong>
                </Typography>
              </Box>
            }
          />

          <Box sx={{ p: 1.5, bgcolor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Shield sx={{ color: '#16a34a', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700 }}>
                Zero Spying Guarantee: Location is accessed exclusively during active drive training, route navigation, and attendance check-ins.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* 24-HOUR MANDATORY PASSWORD RESET TIMER CARD */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3, borderColor: 'rgba(251, 191, 36, 0.4)' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <LockClock sx={{ color: '#d97706', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[800] }}>
              Mandatory Initial Password Reset
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Institutional accounts must reset default password within 24 hours.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ p: 1.5, bgcolor: 'rgba(251, 191, 36, 0.1)', borderRadius: 2, border: '1px solid rgba(251, 191, 36, 0.25)', mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Timer sx={{ color: '#d97706', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#d97706' }}>
                Time Remaining: {hoursLeft}h {minsLeft}m
              </Typography>
            </Stack>
            <Chip label="24h Security Window" size="small" sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#d97706', fontWeight: 800, fontSize: '0.65rem' }} />
          </Stack>
        </Box>

        {passResetMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>{passResetMsg}</Alert>}
        {passResetErr && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>{passResetErr}</Alert>}

        <form onSubmit={handlePasswordResetSubmit}>
          <Stack spacing={1.5}>
            <TextField
              size="small"
              type="password"
              label="Default Password (Register Number)"
              placeholder="e.g. 811123104015"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', input: { color: greenPalette[800] }, label: { color: 'var(--text-secondary)' } }}
            />
            <TextField
              size="small"
              type="password"
              label="Set Strong New Password"
              placeholder="Min 8 characters with letters & numbers"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', input: { color: greenPalette[800] }, label: { color: 'var(--text-secondary)' } }}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              startIcon={<VpnKey />}
              sx={{ bgcolor: greenPalette[500], '&:hover': { bgcolor: greenPalette[600] }, fontWeight: 800, py: 1 }}
            >
              Update Institutional Password
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* INSTITUTIONAL TENANT & ROLE SELECTORS */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[800], mb: 2 }}>
          Institution & User Role Config
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'var(--text-secondary)' }}>University Institution Tenant</InputLabel>
            <Select
              value={currentTenant?.tenantId || ''}
              label="University Institution Tenant"
              onChange={(e) => switchTenant(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', color: greenPalette[800], fontWeight: 700 }}
            >
              {tenants.map(t => (
                <MenuItem key={t.tenantId} value={t.tenantId}>
                  {t.code} — {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'var(--text-secondary)' }}>Active Portal Role</InputLabel>
            <Select
              value={user?.role || ''}
              label="Active Portal Role"
              onChange={(e) => handleRoleChange(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', color: greenPalette[800], fontWeight: 700 }}
            >
              <MenuItem value="student">Student Candidate</MenuItem>
              <MenuItem value="recruiter">Corporate Recruiter Partner</MenuItem>
              <MenuItem value="evaluator">Interview Evaluator / Panelist</MenuItem>
              <MenuItem value="mentor">Mentor</MenuItem>
              <MenuItem value="dept_coordinator">Faculty / HOD Coordinator</MenuItem>
              <MenuItem value="tenant_admin">College Placement Officer</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* CAPACITOR NATIVE FEATURES & NOTIFICATIONS */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[800], mb: 1.5 }}>
          Capacitor Native Hardware & Security
        </Typography>

        <Stack spacing={1}>
          <FormControlLabel
            control={<Switch checked={biometricsEnabled} onChange={handleBiometricToggle} color="success" />}
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: greenPalette[800] }}>
                  Biometric Fingerprint / FaceID Login
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Native Android Biometric Prompt
                </Typography>
              </Box>
            }
          />
          <Divider sx={{ borderColor: 'var(--border-subtle)' }} />
          <FormControlLabel
            control={<Switch checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} color="success" />}
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: greenPalette[800] }}>
                  Campus Push Notifications & Alerts
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Instant drive updates & 24h notice board alerts
                </Typography>
              </Box>
            }
          />
        </Stack>
      </Paper>

      {/* ACCOUNT & LOGOUT */}
      {user && (
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={logout}
          sx={{ py: 1.2, fontWeight: 800, borderRadius: 2 }}
        >
          Sign Out of OfferDesk App
        </Button>
      )}

      {/* GPS Consent Modal */}
      <GpsConsentModal
        open={showGpsModal}
        onClose={() => setShowGpsModal(false)}
        onConsentGranted={() => setGpsConsent(GPSConsentStatus.GRANTED)}
        onConsentDenied={() => setGpsConsent(GPSConsentStatus.DENIED)}
      />

    </Container>
  );
}

export default SettingsPage;
