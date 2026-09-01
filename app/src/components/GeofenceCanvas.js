import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, Stack, IconButton, Slider, Tooltip, Chip } from '@mui/material';
import { SatelliteAlt, Map, ZoomIn, ZoomOut, MyLocation, CheckCircle, Warning, Tune } from '@mui/icons-material';
import { GpsLocationService } from '../services/gpsLocationService';
import { greenPalette } from '../theme';

/**
 * GeofenceCanvas Component
 * Canvas-based interactive map renderer supporting Satellite & Street View base layers,
 * visual geofence radius adjustment, real-time user GPS tracking, and route navigation.
 */
export function GeofenceCanvas({
  centerLat = 12.9716,
  centerLon = 77.5946,
  venueName = 'Training Venue',
  userLat = null,
  userLon = null,
  radiusMeters = 250,
  onRadiusChange = null,
  onVenueMove = null,
  readOnly = false,
  height = 360
}) {
  const canvasRef = useRef(null);
  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite' | 'street'
  const [zoomLevel, setZoomLevel] = useState(16); // 14 to 19
  const [radius, setRadius] = useState(radiusMeters);
  const [isHovered, setIsHovered] = useState(false);
  const [activePin, setActivePin] = useState({ lat: centerLat, lon: centerLon });

  useEffect(() => {
    setRadius(radiusMeters);
  }, [radiusMeters]);

  useEffect(() => {
    setActivePin({ lat: centerLat, lon: centerLon });
  }, [centerLat, centerLon]);

  const handleRadiusSlider = (e, newValue) => {
    setRadius(newValue);
    if (onRadiusChange) onRadiusChange(newValue);
  };

  const toggleMapLayer = () => {
    setMapLayer(prev => prev === 'satellite' ? 'street' : 'satellite');
  };

  // Calculate geofence status
  const geofenceResult = (userLat && userLon) 
    ? GpsLocationService.checkGeofenceStatus(userLat, userLon, activePin.lat, activePin.lon, radius)
    : { inside: false, distanceMeters: 0 };

  /**
   * Main Render Canvas Loop
   */
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Scale factor based on zoom level (pixels per meter approximation)
    const pxPerMeter = Math.pow(2, zoomLevel - 16) * 1.2;

    // ── 1. DRAW BASE LAYER BACKGROUND (Satellite vs Street View) ───────────
    if (mapLayer === 'satellite') {
      // Dark High-Res Satellite Orthophoto simulation
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Satellite Terrain Patch Simulation (Grids & Texture Blocks)
      const tileSize = 64;
      for (let x = 0; x < width; x += tileSize) {
        for (let y = 0; y < height; y += tileSize) {
          const shade = ((x / tileSize + y / tileSize) % 2 === 0) ? '#1e293b' : '#0f172a';
          ctx.fillStyle = shade;
          ctx.fillRect(x, y, tileSize, tileSize);

          // Subtle green vegetation patches
          if ((x * y) % 5 === 0) {
            ctx.fillStyle = 'rgba(20, 83, 45, 0.35)';
            ctx.fillRect(x + 10, y + 10, tileSize - 20, tileSize - 20);
          }
        }
      }

      // Satellite Road / Runway Overlays
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(0, centerY - 40);
      ctx.lineTo(width, centerY + 60);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(203, 213, 225, 0.3)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(centerX - 100, 0);
      ctx.lineTo(centerX + 80, height);
      ctx.stroke();

      // Satellite Imagery Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let g = 0; g < width; g += 50) {
        ctx.beginPath();
        ctx.moveTo(g, 0);
        ctx.lineTo(g, height);
        ctx.stroke();
      }
      for (let g = 0; g < height; g += 50) {
        ctx.beginPath();
        ctx.moveTo(0, g);
        ctx.lineTo(width, g);
        ctx.stroke();
      }

    } else {
      // Street View Mode - Light Clean Map Design
      ctx.fillStyle = '#eef2f7';
      ctx.fillRect(0, 0, width, height);

      // Street View Green Parks
      ctx.fillStyle = '#dcfce7';
      ctx.beginPath();
      ctx.roundRect(centerX - 180, centerY - 140, 140, 110, 16);
      ctx.fill();

      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect(centerX + 60, centerY + 40, 150, 90, 16);
      ctx.fill();

      // Street View Roads & Block Grids
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(0, centerY - 30);
      ctx.lineTo(width, centerY + 40);
      ctx.stroke();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY - 30);
      ctx.lineTo(width, centerY + 40);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(centerX - 80, 0);
      ctx.lineTo(centerX + 60, height);
      ctx.stroke();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 80, 0);
      ctx.lineTo(centerX + 60, height);
      ctx.stroke();

      // Buildings Outlines
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(centerX - 120, centerY + 30, 60, 45);
      ctx.fillRect(centerX + 40, centerY - 120, 75, 50);

      // Street Grid Subtle Dots
      ctx.fillStyle = '#94a3b8';
      for (let gx = 25; gx < width; gx += 50) {
        for (let gy = 25; gy < height; gy += 50) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // ── 2. DRAW GEOFENCE CIRCLE & BOUNDARY ────────────────────────────────
    const visualRadius = radius * pxPerMeter;
    const isUserInside = geofenceResult.inside;

    // Fill ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, visualRadius, 0, Math.PI * 2);
    if (isUserInside) {
      ctx.fillStyle = mapLayer === 'satellite' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = '#10b981';
    } else {
      ctx.fillStyle = mapLayer === 'satellite' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)';
      ctx.strokeStyle = '#ef4444';
    }
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Geofence Radius Label Tag on Circle Border
    ctx.fillStyle = isUserInside ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.roundRect(centerX + visualRadius - 35, centerY - 14, 70, 22, 11);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${radius}m Zone`, centerX + visualRadius, centerY + 1);

    // ── 3. DRAW NAVIGATION ROUTE LINE & USER MARKER ──────────────────────
    if (userLat && userLon) {
      // Calculate user position offset relative to center pin
      const latDiff = (userLat - activePin.lat) * 111320; // meters lat
      const lonDiff = (userLon - activePin.lon) * (111320 * Math.cos((activePin.lat * Math.PI) / 180)); // meters lon

      const userX = centerX + lonDiff * pxPerMeter;
      const userY = centerY - latDiff * pxPerMeter;

      // Draw Navigation Path Line
      ctx.beginPath();
      ctx.moveTo(userX, userY);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = mapLayer === 'satellite' ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw User GPS Pulsing Marker
      ctx.beginPath();
      ctx.arc(userX, userY, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(userX, userY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();

      // User Tag
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(userX - 35, userY - 32, 70, 18, 9);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOUR GPS', userX, userY - 20);
    }

    // ── 4. DRAW DRIVE VENUE PIN MARKER (CENTER) ──────────────────────────
    // Pin Shadow
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 8, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // Pin Body (Red / Amber Placement Pin)
    ctx.beginPath();
    ctx.arc(centerX, centerY - 14, 12, Math.PI, 0, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = '#dc2626';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY - 14, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Venue Name Tag Label
    ctx.fillStyle = mapLayer === 'satellite' ? '#1e293b' : '#0f172a';
    const tagWidth = Math.min(220, ctx.measureText(venueName).width + 24);
    ctx.beginPath();
    ctx.roundRect(centerX - tagWidth / 2, centerY - 46, tagWidth, 22, 11);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(venueName, centerX, centerY - 31);

    // Canvas Border
    ctx.strokeStyle = mapLayer === 'satellite' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

  }, [mapLayer, zoomLevel, radius, centerLat, centerLon, userLat, userLon, venueName, activePin, geofenceResult.inside]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Click on Canvas to change target venue pin (if editable)
  const handleCanvasClick = (e) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pxPerMeter = Math.pow(2, zoomLevel - 16) * 1.2;
    const deltaX = (x - centerX) / pxPerMeter;
    const deltaY = (centerY - y) / pxPerMeter;

    const newLat = activePin.lat + deltaY / 111320;
    const newLon = activePin.lon + deltaX / (111320 * Math.cos((activePin.lat * Math.PI) / 180));

    setActivePin({ lat: newLat, lon: newLon });
    if (onVenueMove) onVenueMove(newLat, newLon);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', borderRadius: '20px', overflow: 'hidden', boxShadow: '6px 6px 14px #cbd5e1, -6px -6px 14px #ffffff' }}>
      
      {/* ── TOP FLOATING CONTROL BAR ────────────────────────────────────────── */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ 
          position: 'absolute', 
          top: 12, 
          left: 12, 
          right: 12, 
          zIndex: 10,
          pointerEvents: 'auto'
        }}
      >
        {/* SATELLITE VS STREET VIEW TOGGLE BUTTON (PRIMARY REQUIREMENT) */}
        <Button
          variant="contained"
          size="small"
          onClick={toggleMapLayer}
          startIcon={mapLayer === 'satellite' ? <SatelliteAlt sx={{ color: '#38bdf8' }} /> : <Map sx={{ color: greenPalette.A700 }} />}
          sx={{
            bgcolor: mapLayer === 'satellite' ? '#0f172a' : '#ffffff',
            color: mapLayer === 'satellite' ? '#ffffff' : '#0f172a',
            fontWeight: 800,
            fontSize: '0.75rem',
            borderRadius: '14px',
            px: 2,
            py: 0.8,
            boxShadow: '4px 4px 12px rgba(0,0,0,0.3)',
            border: '1.5px solid',
            borderColor: mapLayer === 'satellite' ? '#38bdf8' : greenPalette.A700,
            transition: 'all 0.25s ease',
            '&:hover': {
              bgcolor: mapLayer === 'satellite' ? '#1e293b' : '#f8fafc',
              transform: 'scale(1.03)'
            }
          }}
        >
          {mapLayer === 'satellite' ? 'Satellite View 🛰️' : 'Street View 🗺️'}
        </Button>

        {/* Zoom & Center Controls */}
        <Stack direction="row" spacing={0.8} sx={{ bgcolor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', p: 0.5, borderRadius: '14px' }}>
          <Tooltip title="Snap Pin to My Device Hardware GPS">
            <IconButton 
              size="small" 
              onClick={async () => {
                try {
                  const pos = await GpsLocationService.getCurrentPosition();
                  if (pos && pos.latitude && pos.longitude) {
                    setActivePin({ lat: pos.latitude, lon: pos.longitude });
                    if (onVenueMove) onVenueMove(pos.latitude, pos.longitude);
                  }
                } catch (e) {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (p) => {
                        setActivePin({ lat: p.coords.latitude, lon: p.coords.longitude });
                        if (onVenueMove) onVenueMove(p.coords.latitude, p.coords.longitude);
                      },
                      (err) => alert('Unable to acquire hardware GPS: ' + err.message)
                    );
                  }
                }
              }}
              sx={{ color: '#38bdf8' }}
            >
              <MyLocation fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom In">
            <IconButton 
              size="small" 
              onClick={() => setZoomLevel(z => Math.min(19, z + 1))}
              sx={{ color: '#ffffff' }}
            >
              <ZoomIn fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton 
              size="small" 
              onClick={() => setZoomLevel(z => Math.max(14, z - 1))}
              sx={{ color: '#ffffff' }}
            >
              <ZoomOut fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* ── CANVAS ELEMENT ──────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        width={500}
        height={height}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'block',
          cursor: readOnly ? 'default' : 'crosshair'
        }}
      />

      {/* ── BOTTOM STATUS BAR OVERLAY ────────────────────────────────────────── */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          bgcolor: mapLayer === 'satellite' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(8px)',
          p: 1.5,
          borderTop: '1px solid',
          borderColor: mapLayer === 'satellite' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            {geofenceResult.inside ? (
              <Chip 
                icon={<CheckCircle sx={{ color: '#ffffff !important' }} />} 
                label="INSIDE GEOFENCE ZONE" 
                size="small"
                sx={{ bgcolor: '#10b981', color: '#ffffff', fontWeight: 800, fontSize: '0.65rem' }} 
              />
            ) : (
              <Chip 
                icon={<Warning sx={{ color: '#ffffff !important' }} />} 
                label={userLat ? `OUTSIDE ZONE (${geofenceResult.distanceMeters}m away)` : 'GPS NOT ACQUIRED'} 
                size="small"
                sx={{ bgcolor: userLat ? '#ef4444' : '#64748b', color: '#ffffff', fontWeight: 800, fontSize: '0.65rem' }} 
              />
            )}

            {!readOnly && (
              <Typography variant="caption" sx={{ color: mapLayer === 'satellite' ? '#94a3b8' : '#64748b', fontSize: '0.7rem', display: { xs: 'none', sm: 'inline' } }}>
                Click map canvas to set venue location
              </Typography>
            )}
          </Stack>

          {/* Radius Adjustment Slider if editable */}
          {!readOnly && onRadiusChange && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 140 }}>
              <Tune fontSize="small" sx={{ color: mapLayer === 'satellite' ? '#38bdf8' : greenPalette.A700, fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: mapLayer === 'satellite' ? '#ffffff' : '#0f172a', fontSize: '0.7rem' }}>
                {radius}m
              </Typography>
              <Slider
                size="small"
                value={radius}
                min={50}
                max={1000}
                step={25}
                onChange={handleRadiusSlider}
                sx={{
                  color: mapLayer === 'satellite' ? '#38bdf8' : greenPalette.A700,
                  width: 70
                }}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

export default GeofenceCanvas;
