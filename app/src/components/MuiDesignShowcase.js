import React from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  LinearProgress, 
  useTheme, 
  useMediaQuery, 
  Stack,
  Paper
} from '@mui/material';
import { 
  CheckCircle, 
  Palette, 
  TextFields, 
  MotionPhotosAuto, 
  PhoneIphone, 
  Computer 
} from '@mui/icons-material';
import { greenPalette } from '../theme';

export function MuiDesignShowcase() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          background: 'linear-gradient(135deg, #0b1120 0%, #1e293b 100%)',
          borderRadius: 4,
          border: `1px solid ${greenPalette[500]}40`
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip 
              icon={<CheckCircle sx={{ color: `${greenPalette.A400} !important` }} />} 
              label="Material UI v5 Active" 
              sx={{ 
                bgcolor: `${greenPalette[900]}80`, 
                color: greenPalette.A200, 
                fontWeight: 700, 
                border: `1px solid ${greenPalette[700]}` 
              }} 
            />
            <Chip 
              icon={isMobile ? <PhoneIphone /> : <Computer />} 
              label={isMobile ? "Mobile Viewport" : "Desktop Viewport"} 
              color="primary" 
              variant="outlined" 
            />
          </Stack>

          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: greenPalette[300] }}>
            OfferDesk Material UI Design System
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Custom Material Design engine configured with exact Green Palette (#4caf50), responsive typography, custom transitions, and mobile-first layout grid.
          </Typography>
        </Box>

        {/* Feature Grid */}
        <Grid container spacing={3}>
          {/* Green Color Palette Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.7)', height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Palette sx={{ color: greenPalette[400] }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Custom Green Palette (#4caf50)
                  </Typography>
                </Stack>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {[
                    { label: '50', code: greenPalette[50], darkText: true },
                    { label: '100', code: greenPalette[100], darkText: true },
                    { label: '200', code: greenPalette[200], darkText: true },
                    { label: '300', code: greenPalette[300] },
                    { label: '400', code: greenPalette[400] },
                    { label: '500 (Main)', code: greenPalette[500] },
                    { label: '600', code: greenPalette[600] },
                    { label: '700', code: greenPalette[700] },
                    { label: '800', code: greenPalette[800] },
                    { label: '900', code: greenPalette[900] },
                    { label: 'A100', code: greenPalette.A100, darkText: true },
                    { label: 'A200', code: greenPalette.A200, darkText: true },
                    { label: 'A400', code: greenPalette.A400, darkText: true },
                    { label: 'A700', code: greenPalette.A700, darkText: true },
                  ].map((c) => (
                    <Grid item xs={3} sm={2.4} key={c.label}>
                      <Box 
                        sx={{ 
                          bgcolor: c.code, 
                          color: c.darkText ? '#000000' : '#ffffff', 
                          p: 1, 
                          borderRadius: 1.5, 
                          textAlign: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {c.label}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary">
                    Primary Button (#4caf50)
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Accent (#00e676)
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Responsive Typography & Transitions */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.7)', height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <TextFields sx={{ color: greenPalette[400] }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Responsive Typography & Transitions
                  </Typography>
                </Stack>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: greenPalette.A200 }}>
                    Fluid Heading (Responsive h4)
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Material UI responsiveFontSizes() automatically resizes typography variants across mobile, tablet, and desktop viewports seamlessly.
                  </Typography>
                </Box>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <MotionPhotosAuto sx={{ color: greenPalette[300] }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    System Motion & Transitions Timing
                  </Typography>
                </Stack>
                <Box sx={{ width: '100%', mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      bgcolor: greenPalette[900], 
                      '& .MuiLinearProgress-bar': { bgcolor: greenPalette.A400 } 
                    }} 
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Custom timing easing: cubic-bezier(0.4, 0, 0.2, 1) • Standard duration: 300ms
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default MuiDesignShowcase;
