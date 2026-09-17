import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, Stack, Chip, Alert, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { GpsFixed, CheckCircle, Place, Lock, Refresh, CheckCircleOutlined } from '@mui/icons-material';
import GeofenceCanvas from './GeofenceCanvas';
import GpsConsentModal from './GpsConsentModal';
import { GpsLocationService, GPSConsentStatus } from '../services/gpsLocationService';
import { greenPalette } from '../theme';

export function DriveNavigationTracker({
  driveTitle = 'Recruitment Drive Training',
  companyName = 'Partner Company',
  venueName = 'Campus Training Venue',
  venueLat = 12.9716,
  venueLon = 77.5946,
  radiusMeters = 250,
  onAttendanceCheckedIn = null
}) {
  const [consentStatus, setConsentStatus] = useState(GpsLocationService.getConsentStatus());
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = (e) => {
      setConsentStatus(e.detail);
    };
    window.addEventListener('gpsConsentChanged', handleConsentChange);
    return () => window.removeEventListener('gpsConsentChanged', handleConsentChange);
  }, []);

  // Acquire current location if consent granted
  const fetchCurrentLocation = useCallback(async () => {
    if (consentStatus !== GPSConsentStatus.GRANTED) {
      setShowConsentModal(true);
      return;
    }
    setErrorMsg(null);
    try {
      const pos = await GpsLocationService.getCurrentPosition();
      setUserLocation(pos);
    } catch (err) {
      console.warn('GPS location error:', err);
      setErrorMsg('Unable to retrieve GPS signal. Please ensure location services are enabled.');
      setUserLocation(null);
    }
  }, [consentStatus, venueLat, venueLon]);

  // Start continuous watch tracking
  const startLiveTracking = useCallback(() => {
    if (consentStatus !== GPSConsentStatus.GRANTED) {
      setShowConsentModal(true);
      return;
    }
    fetchCurrentLocation();
    const id = GpsLocationService.watchPosition(
      (pos) => {
        setUserLocation(pos);
        setIsTracking(true);
      },
      (err) => {
        console.warn('GPS watch error:', err);
        setIsTracking(false);
      }
    );
    setWatchId(id);
  }, [consentStatus, fetchCurrentLocation]);

  const stopLiveTracking = useCallback(() => {
    if (watchId !== null) {
      GpsLocationService.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  }, [watchId]);

  useEffect(() => {
    if (consentStatus === GPSConsentStatus.GRANTED) {
      fetchCurrentLocation();
    }
    return () => {
      stopLiveTracking();
    };
  }, [consentStatus, fetchCurrentLocation, stopLiveTracking]);

  const geofenceResult = userLocation
    ? GpsLocationService.checkGeofenceStatus(userLocation.latitude, userLocation.longitude, venueLat, venueLon, radiusMeters)
    : { inside: false, distanceMeters: 0 };

  const handleCheckIn = () => {
    if (!geofenceResult.inside) return;
    setCheckingIn(true);
    setTimeout(() => {
      setCheckingIn(false);
      setCheckedIn(true);
      if (onAttendanceCheckedIn) {
        onAttendanceCheckedIn({
          timestamp: new Date().toISOString(),
          location: userLocation,
          venue: venueName,
          geofenceVerified: true
        });
      }
    }, 1000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '24px',
        bgcolor: '#eef2f7',
        boxShadow: '8px 8px 20px #cbd5e1, -8px -8px 20px #ffffff',
        border: '1px solid rgba(255, 255, 255, 0.9)'
      }}
    >
      {/* Header Info & Consent Pill */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b', fontSize: '1rem' }}>
              {driveTitle}
            </Typography>
            <Chip label={companyName} size="small" sx={{ fontWeight: 800, bgcolor: '#e2e8f0', color: '#334155', fontSize: '0.7rem' }} />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Place fontSize="small" sx={{ color: '#dc2626', fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700 }}>
              {venueName} ({radiusMeters}m Geofence)
            </Typography>
          </Stack>
        </Box>

        {/* GPS Consent Status Button */}
        {consentStatus === GPSConsentStatus.GRANTED ? (
          <Chip
            icon={<GpsFixed sx={{ color: '#ffffff !important' }} />}
            label="GPS Consent Granted"
            size="small"
            onClick={() => setShowConsentModal(true)}
            sx={{
              bgcolor: greenPalette.A700,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.68rem',
              boxShadow: '3px 3px 8px #cbd5e1'
            }}
          />
        ) : (
          <Button
            size="small"
            variant="contained"
            color="warning"
            onClick={() => setShowConsentModal(true)}
            startIcon={<Lock fontSize="small" />}
            sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: '12px' }}
          >
            Enable Location Access
          </Button>
        )}
      </Stack>

      {/* Embedded Geofence Canvas with Satellite / Street View Toggle */}
      <GeofenceCanvas
        centerLat={venueLat}
        centerLon={venueLon}
        venueName={venueName}
        userLat={userLocation?.latitude}
        userLon={userLocation?.longitude}
        radiusMeters={radiusMeters}
        readOnly={true}
        height={320}
      />

      {/* GPS Position Metrics Bar */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#e2e8f0', borderRadius: '16px', boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block', fontSize: '0.65rem' }}>
              YOUR VERIFIED GPS COORDINATES
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
              {userLocation
                ? GpsLocationService.formatCoordinates(userLocation.latitude, userLocation.longitude)
                : 'Awaiting Location Signal...'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box textAlign="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block', fontSize: '0.65rem' }}>
                DISTANCE
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: geofenceResult.inside ? '#10b981' : '#dc2626', fontSize: '0.85rem' }}>
                {userLocation ? `${geofenceResult.distanceMeters} meters` : '--'}
              </Typography>
            </Box>

            <Box textAlign="center">
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block', fontSize: '0.65rem' }}>
                ACCURACY
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284c7', fontSize: '0.85rem' }}>
                {userLocation?.accuracy ? `±${Math.round(userLocation.accuracy)}m` : '±10m'}
              </Typography>
            </Box>

            <Tooltip title="Refresh GPS Signal">
              <IconButton size="small" onClick={fetchCurrentLocation} sx={{ bgcolor: '#eef2f7', boxShadow: '3px 3px 6px #cbd5e1' }}>
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

        </Stack>
      </Box>

      {/* Geofence Attendance Verification Action Button */}
      <Box sx={{ mt: 2 }}>
        {checkedIn ? (
          <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ borderRadius: '16px', fontWeight: 700 }}>
            🎉 Drive Attendance Verified via Geofence! GPS timestamp recorded.
          </Alert>
        ) : (
          <Button
            fullWidth
            size="medium"
            variant="contained"
            disabled={!geofenceResult.inside || checkingIn}
            onClick={handleCheckIn}
            startIcon={checkingIn ? <CircularProgress size={18} color="inherit" /> : <CheckCircleOutlined />}
            sx={{
              py: 1.4,
              borderRadius: '16px',
              fontWeight: 900,
              fontSize: '0.88rem',
              bgcolor: geofenceResult.inside ? greenPalette.A700 : '#cbd5e1',
              color: '#ffffff',
              boxShadow: geofenceResult.inside ? '4px 4px 12px #cbd5e1, -4px -4px 12px #ffffff' : 'none',
              '&:hover': {
                bgcolor: geofenceResult.inside ? greenPalette[800] : '#cbd5e1'
              }
            }}
          >
            {checkingIn
              ? 'Verifying Geofence Check-In...'
              : geofenceResult.inside
              ? 'VERIFY GEOFENCED DRIVE ATTENDANCE'
              : `MOVE INSIDE GEOFENCE ZONE TO CHECK-IN (${geofenceResult.distanceMeters}m AWAY)`}
          </Button>
        )}
      </Box>

      {/* GPS Consent Modal Prompt */}
      <GpsConsentModal
        open={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsentGranted={() => {
          setConsentStatus(GPSConsentStatus.GRANTED);
          fetchCurrentLocation();
        }}
        onConsentDenied={() => {
          setConsentStatus(GPSConsentStatus.DENIED);
        }}
      />
    </Paper>
  );
}

export default DriveNavigationTracker;
