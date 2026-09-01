import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import appIconImg from '../assets/app-icon.png';
import { greenPalette } from '../theme';

/**
 * Neumorphic Soft Light Splash Loader Component matching Landing Page theme
 */
export function SplashLoader({ message = "Booting OfferDesk Mobile...", subtitle = "Material UI & Native Capacitor Engine" }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        bgcolor: '#eef2f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1e293b',
        overflow: 'hidden'
      }}
    >
      {/* Neumorphic Soft Shadow Ring Container */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: 130, 
          height: 130, 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: '#eef2f7',
          boxShadow: '12px 12px 28px #cbd5e1, -12px -12px 28px #ffffff'
        }}
      >
        {/* Outer Rotating Emerald Ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: greenPalette.A700,
            borderRightColor: greenPalette[600],
            animation: 'spinClockwise 1.2s linear infinite'
          }}
        />

        {/* Center Brand Avatar Logo */}
        <Avatar
          src={appIconImg}
          alt="OfferDesk Mobile Logo"
          sx={{
            width: 72,
            height: 72,
            boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff',
            p: 0.5,
            bgcolor: '#eef2f7'
          }}
        />
      </Box>

      {/* Typography Brand & Message */}
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5, mb: 0.5 }}>
        OfferDesk <span style={{ color: greenPalette.A700 }}>App</span>
      </Typography>

      <Typography variant="body2" sx={{ color: '#047857', fontWeight: 800, mb: 1, letterSpacing: 0.2 }}>
        {message}
      </Typography>

      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
        {subtitle}
      </Typography>

      {/* Embedded Animation */}
      <style>{`
        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

export default SplashLoader;
