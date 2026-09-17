import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, Stack, Avatar, Chip, Grid, LinearProgress, Tooltip } from '@mui/material';
import { Email, Verified, CheckCircle, Send } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { greenPalette } from '../theme';
import RegisterOtpModal from './RegisterOtpModal';

export function ProfilePage() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(user?.isEmailVerified || false);
  const [verifiedDept, setVerifiedDept] = useState(user?.department || '');

  const atsScore = user?.atsScore || null;
  const userSkills = user?.skills 
    ? (Array.isArray(user.skills) ? user.skills : user.skills.split(',').map(s => s.trim()))
    : [];

  const handleVerifiedOtp = (verifiedUser) => {
    setEmailVerified(true);
    if (verifiedUser?.department) {
      setVerifiedDept(verifiedUser.department);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
      
      {/* PROFILE CARD BANNER */}
      <Paper 
        className="glass-card" 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 4, 
          border: '1px solid var(--border-emerald-glow)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, background: 'radial-gradient(circle, rgba(76, 175, 80, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              sx={{ 
                width: 72, 
                height: 72, 
                bgcolor: greenPalette[700], 
                fontSize: '2rem', 
                fontWeight: 900,
                border: '3px solid var(--color-primary-400)',
                boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)'
              }}
            >
              {user?.name ? user.name[0] : 'U'}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: greenPalette[800] }}>
                  {user?.name || 'Unspecified Candidate'}
                </Typography>
                {emailVerified && (
                  <Tooltip title="University Domain Email Verified">
                    <Verified sx={{ color: greenPalette.A400, fontSize: 20 }} />
                  </Tooltip>
                )}
              </Stack>

              {user?.regNo && (
                <Typography variant="caption" sx={{ color: greenPalette[700], fontWeight: 700, display: 'block' }}>
                  Reg No: {user.regNo} {user.batch ? `• Class of ${user.batch}` : ''}
                </Typography>
              )}

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip 
                  label={currentTenant?.code || ''} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: greenPalette[800], fontWeight: 800, fontSize: '0.65rem' }} 
                />
                <Chip 
                  label={user?.role?.toUpperCase() || 'USER'} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#0284c7', fontWeight: 800, fontSize: '0.65rem' }} 
                />
              </Stack>
            </Box>
          </Stack>

          {/* EMAIL VERIFICATION STATUS & BREVO OTP ACTION */}
          <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2.5, border: '1px solid var(--border-subtle)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Official Institutional Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: greenPalette[800] }}>
                  {user?.email || 'Not Provided'}
                </Typography>
              </Box>

              {emailVerified ? (
                <Chip 
                  icon={<CheckCircle sx={{ fontSize: '1rem !important', color: `${greenPalette[700]} !important` }} />}
                  label="Verified" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette[700], fontWeight: 800 }} 
                />
              ) : (
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<Send />}
                  onClick={() => setOtpModalOpen(true)}
                  sx={{ bgcolor: greenPalette[500], fontSize: '0.7rem', fontWeight: 800 }}
                >
                  Verify OTP
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* ACADEMIC & GROQ AI ATS RESUME METRICS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Paper className="glass-card" sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>ACADEMIC CGPA</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: greenPalette[700], my: 0.5 }}>
              {user?.gpa ? user.gpa : 'N/A'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className="glass-card" sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>GROQ AI ATS SCORE</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#9333ea', my: 0.5 }}>
              {atsScore !== null ? `${atsScore}/100` : 'N/A'}
            </Typography>
            {atsScore !== null && (
              <LinearProgress variant="determinate" value={atsScore} sx={{ height: 6, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#9333ea' } }} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* DEPARTMENT & SKILLS TAGS */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[800], mb: 1.5 }}>
          Academic Department & Core Skills
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Department: <strong style={{ color: greenPalette[800] }}>{verifiedDept || 'Not Specified'}</strong>
        </Typography>

        {userSkills.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {userSkills.map((skill, idx) => (
              <Chip 
                key={idx} 
                label={skill} 
                size="small" 
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', color: greenPalette[800], border: '1px solid var(--border-subtle)', fontWeight: 700 }} 
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">No technical skills added yet.</Typography>
        )}
      </Paper>

      {/* RECRUITMENT DRIVES & OFFER STATUS */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[800], mb: 2 }}>
          Applied Placement Drives & Offers
        </Typography>

        {user?.offers && user.offers.length > 0 ? (
          <Stack spacing={1.5}>
            {user.offers.map((off, idx) => (
              <Box key={idx} sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2, border: '1px solid var(--border-subtle)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: greenPalette[800] }}>{off.companyName}</Typography>
                    <Typography variant="caption" color="text.secondary">{off.designation} • {off.packageLpa} LPA</Typography>
                  </Box>
                  <Chip label={off.status} size="small" color="success" sx={{ fontWeight: 800 }} />
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.secondary">No placement drives applied or offer records found.</Typography>
        )}
      </Paper>

      {/* BREVO INSTITUTION EMAIL OTP MODAL */}
      <RegisterOtpModal 
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerified={handleVerifiedOtp}
      />

    </Container>
  );
}

export default ProfilePage;
