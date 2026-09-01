import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stack, Avatar, Paper } from '@mui/material';
import { GpsFixed, Shield, Navigation, VerifiedUser, CheckCircle } from '@mui/icons-material';
import { GpsLocationService, GPSConsentStatus } from '../services/gpsLocationService';
import { greenPalette } from '../theme';

export function GpsConsentModal({ open, onClose, onConsentGranted, onConsentDenied, roleName = 'User' }) {
  const handleAllow = () => {
    GpsLocationService.setConsentStatus(GPSConsentStatus.GRANTED);
    if (onConsentGranted) onConsentGranted();
    if (onClose) onClose();
  };

  const handleDeny = () => {
    GpsLocationService.setConsentStatus(GPSConsentStatus.DENIED);
    if (onConsentDenied) onConsentDenied();
    if (onClose) onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          bgcolor: '#eef2f7',
          p: 1,
          boxShadow: '16px 16px 40px #b8c4d4, -16px -16px 40px #ffffff'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar 
            sx={{ 
              bgcolor: greenPalette.A700, 
              color: '#ffffff',
              width: 44,
              height: 44,
              boxShadow: '4px 4px 10px #cbd5e1, -4px -4px 10px #ffffff'
            }}
          >
            <GpsFixed />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem', lineHeight: 1.2 }}>
              Location Permission
            </Typography>
            <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700 }}>
              Campus Drive Navigation & Geofence
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box sx={{ my: 1.5 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              bgcolor: '#e2e8f0', 
              borderRadius: '16px', 
              boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff',
              mb: 2
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', fontSize: '0.82rem', mb: 1.5 }}>
              OfferDesk requests access to your device's GPS location while using navigation and attendance verification.
            </Typography>

            <Stack spacing={1.2}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Navigation fontSize="small" sx={{ color: greenPalette.A700, mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>
                    Drive Route Navigation
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem' }}>
                    Turn-by-turn distance and directions to assigned placement drive venues & test centers.
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <VerifiedUser fontSize="small" sx={{ color: '#0284c7', mt: 0.2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#0f172a' }}>
                    Geofenced Attendance Check-In
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem' }}>
                    Validates presence within authorized college geofence zones during drive training and attendance.
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>

          {/* Privacy & Anti-Spying Guarantee Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Shield sx={{ color: '#059669', fontSize: 24 }} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#065f46', display: 'block', lineHeight: 1.2 }}>
                Zero Spying & Strict Privacy Protection
              </Typography>
              <Typography variant="caption" sx={{ color: '#047857', fontSize: '0.68rem' }}>
                Location is accessed ONLY during active drive navigation and attendance sessions. You can revoke access at any time in Settings.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
        <Button 
          onClick={handleDeny} 
          size="small"
          variant="text"
          sx={{ 
            color: '#64748b', 
            fontWeight: 700,
            borderRadius: '12px',
            px: 2
          }}
        >
          Not Now / Deny
        </Button>
        <Button 
          onClick={handleAllow} 
          size="medium"
          variant="contained"
          startIcon={<CheckCircle />}
          sx={{ 
            bgcolor: greenPalette.A700, 
            color: '#ffffff',
            fontWeight: 800,
            borderRadius: '12px',
            px: 2.5,
            boxShadow: '4px 4px 10px #cbd5e1, -4px -4px 10px #ffffff',
            '&:hover': { bgcolor: greenPalette[800] }
          }}
        >
          Allow GPS Access
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GpsConsentModal;
