import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Stack, Grid, Avatar, Chip } from '@mui/material';
import { Hub, Forum, MenuBook, Favorite, FilterList, Gavel, ArrowForward, Psychology } from '@mui/icons-material';
import { greenPalette } from '../theme';

export function HubPage() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Drive Spaces & Chat",
      desc: "Real-time communication & auto-moderated company channels",
      icon: <Forum sx={{ fontSize: 32, color: greenPalette[400] }} />,
      route: "/spaces",
      badge: "Real-Time Chat"
    },
    {
      title: "Non-Placement Hub",
      desc: "GATE, GRE, Higher Studies & Entrepreneurship Incubator",
      icon: <MenuBook sx={{ fontSize: 32, color: '#38bdf8' }} />,
      route: "/non-placement",
      badge: "Higher Ed & Startups"
    },
    {
      title: "Student Wellness Suite",
      desc: "Anonymous mood tracking, stress index & counseling support",
      icon: <Favorite sx={{ fontSize: 32, color: '#f472b6' }} />,
      route: "/wellness",
      badge: "Mental Health Support"
    },
    {
      title: "Offer E-Signature Hub",
      desc: "48-Hour binding offer acceptances & biometric authorization",
      icon: <Gavel sx={{ fontSize: 32, color: '#fbbf24' }} />,
      route: "/acceptance",
      badge: "SHA-256 Secured"
    },
    {
      title: "Candidate Filtering",
      desc: "Placement officer & recruiter ATS vector filter matrix",
      icon: <FilterList sx={{ fontSize: 32, color: greenPalette.A200 }} />,
      route: "/filtering",
      badge: "LLaMA 3.3 Vectors"
    },
    {
      title: "Mentor Network",
      desc: "1-on-1 mentorship bookings & mock technical interview prep",
      icon: <Psychology sx={{ fontSize: 32, color: '#a855f7' }} />,
      route: "/mentor",
      badge: "Mentor Connect"
    }
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
      
      {/* HUB BANNER */}
      <Paper className="glass-card" sx={{ p: 2.5, mb: 3, border: '1px solid var(--border-emerald-glow)' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: greenPalette[700], color: '#ffffff', width: 44, height: 44 }}>
            <Hub />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
              Campus Services Hub
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Central Mobile Portal for All Campus Modules & Suites
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* SERVICES GRID */}
      <Grid container spacing={2}>
        {services.map((s, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper 
              className="glass-card glass-card-hover" 
              onClick={() => navigate(s.route)}
              sx={{ 
                p: 2.5, 
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                transition: 'var(--transition-system)'
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ p: 1, bgcolor: 'rgba(15, 23, 42, 0.7)', borderRadius: 2 }}>
                  {s.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      {s.title}
                    </Typography>
                    <Chip label={s.badge} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: greenPalette[300], fontWeight: 700, fontSize: '0.65rem' }} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 1.5 }}>
                    {s.desc}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: greenPalette[400], fontSize: '0.75rem', fontWeight: 800 }}>
                    <span>Launch Service</span>
                    <ArrowForward sx={{ fontSize: 14 }} />
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

    </Container>
  );
}

export default HubPage;
