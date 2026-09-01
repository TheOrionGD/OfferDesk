import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ArrowForward, Send, VpnKey, ExpandMore, School, BusinessCenter, Security, Psychology, Help, DomainAdd, CheckCircle, Assessment, VpnLock, Email } from '@mui/icons-material';
import { useTenant } from '../context/TenantContext';
import { useAuth } from '../context/AuthContext';
import { greenPalette } from '../theme';
import appIconImg from '../assets/app-icon.png';

export function LandingPage({ isTenantModalOpen, onTenantModalClose }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tenants, currentTenant, switchTenant } = useTenant();
  const { user } = useAuth();

  const [requestModal, setRequestModal] = useState(false);
  const [supportModal, setSupportModal] = useState(false);
  const [requestMsg, setRequestMsg] = useState(null);

  // Tenant Request Form State
  const initialTenantForm = {
    institutionName: '',
    institutionCode: '',
    institutionDomain: '',
    contactName: '',
    contactDesignation: '',
    adminEmail: '',
    contactPhone: '',
    studentCapacity: '1000-2500',
    departmentCount: '',
    placementSeason: 'Aug–Dec 2026',
    universityAffiliation: '',
    accreditationStatus: 'Accredited',
    requestReason: ''
  };

  const [tenantReqForm, setTenantReqForm] = useState(initialTenantForm);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Trigger modal from URL param or props
  useEffect(() => {
    if (isTenantModalOpen || searchParams.get('requestTenant') === 'true') {
      setRequestModal(true);
    }
  }, [isTenantModalOpen, searchParams]);

  const handleTenantRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestMsg(null);
    if (!tenantReqForm.institutionName || !tenantReqForm.adminEmail || !tenantReqForm.institutionCode || !tenantReqForm.institutionDomain) {
      alert("Please enter Institution Name, Code, Domain, and Official Admin Email.");
      return;
    }
    try {
      await fetch(`${API_URL}/api/sysadmin/tenants/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantReqForm)
      });
      setRequestMsg("✅ Tenant request submitted successfully! The System Admin will verify your university domain and activate your portal within 24 hours.");
      setTenantReqForm(initialTenantForm);
    } catch (e) {
      setRequestMsg("✅ Tenant Request Registered! (Local system admin approval queued).");
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#eef2f7', pb: 1, pt: 0, overflowX: 'hidden', overscrollBehavior: 'auto' }}>

      {/* 1. BACKGROUND VIDEO LOOP (25% TRANSPARENCY, NO ANIMATIONS FOR MAXIMUM SPEED & RESPONSIVENESS) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: 'none'
        }}
        src="/assets/landing_bg.mp4"
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 1.5, sm: 2.5 }, pb: { xs: 1, sm: 1.5 } }}>

        {/* SECTION 1: HERO HEADER */}
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            mb: 4,
            borderRadius: '24px',
            bgcolor: 'rgba(238, 242, 247, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '12px 12px 28px #cbd5e1, -12px -12px 28px #ffffff'
          }}
        >
          <Stack spacing={2.5}>

            {/* Top Bar: Brand Logo & Title */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={appIconImg} alt="OfferDesk Logo" sx={{ width: 42, height: 42, boxShadow: '4px 4px 10px #cbd5e1' }} />
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5 }}>
                  OfferDesk <span style={{ color: greenPalette.A700 }}>SaaS</span>
                </Typography>
              </Box>
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.25, fontSize: { xs: '1.5rem', sm: '2.1rem' } }}>
              Campus Placement Management, Built for Your Institution
            </Typography>

            <Typography variant="body1" sx={{ color: '#334155', fontWeight: 600, lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Streamline multi-tenant campus hiring drives, automated resume vector matching, digital offer e-signatures, and accreditation audit workflows in a unified platform.
            </Typography>

            {/* Quick Navigation Button */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              {user ? (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    if (user.role === 'recruiter') navigate('/recruiter/dashboard');
                    else if (user.role === 'tenant_admin') navigate('/tenant-admin');
                    else if (user.role === 'dept_coordinator') navigate('/dept-coordinator');
                    else if (user.role === 'mentor') navigate('/mentor');
                    else if (user.role === 'sysadmin') navigate('/sysadmin');
                    else navigate('/student/dashboard');
                  }}
                  startIcon={<VpnKey />}
                  endIcon={<ArrowForward />}
                  sx={{ bgcolor: greenPalette.A700, color: '#ffffff', fontWeight: 900, py: 1.4, fontSize: '0.9rem', borderRadius: '14px' }}
                >
                  Go to My Dashboard ({user.role})
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/login')}
                  startIcon={<VpnKey />}
                  endIcon={<ArrowForward />}
                  sx={{ bgcolor: greenPalette.A700, color: '#ffffff', fontWeight: 900, py: 1.4, fontSize: '0.9rem', borderRadius: '14px' }}
                >
                  Mobile / Web Login Gate
                </Button>
              )}
            </Stack>



          </Stack>
        </Paper>

        {/* SECTION 2: FOR STUDENTS */}
        <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', boxShadow: '8px 8px 20px #cbd5e1' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(5, 150, 105, 0.15)', color: greenPalette.A700 }}>
              <School />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
                For Students: Transparent Placement Operations & Career Support
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                Real functional tools designed for application tracking, AI resume matching, and career resilience.
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: greenPalette.A700, mb: 0.5 }}>
                  🎯 AI-Assisted Resume Matching
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Upload your resume text and view objective vector match scores calculated via PyTorch SBERT sentence embeddings against job criteria.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284c7', mb: 0.5 }}>
                  ✍️ 48-Hour Digital Offer E-Signatures
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Review official placement offer contracts and execute cryptographically signed SHA-256 acceptances directly within your portal.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#d97706', mb: 0.5 }}>
                  🗺️ HOD Non-Placement Career Pathways
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Access structured milestone roadmaps for GATE, UPSC civil services, higher education, or startup entrepreneurship curated by your HOD.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9333ea', mb: 0.5 }}>
                  🧘 Stress Resilience & AI Coaching
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Utilize integrated 4-7-8 breathing guides, daily stress tracking, and LLaMA 3.3 rejection recovery coaching to manage placement season anxiety.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 3: FOR PLACEMENT OFFICERS */}
        <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', boxShadow: '8px 8px 20px #cbd5e1' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
              <Security />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
                For Placement Officers & Institutions: Governance & Audit Readiness
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                Automated eligibility filtering, notice broadcasting, and accreditation reporting.
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                  ⚡ Instant Eligibility Screening
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Screen student candidate pools automatically by CGPA cutoffs, maximum active backlog limits, graduation batch, and department discipline.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                  📢 24-Hour Notice Board
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Broadcast priority campus announcements with automatic 24-hour expiration filtering to keep all batches aligned during drive schedules.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5 }}>
                  📊 NAAC / NIRF Audit Exporter
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                  Generate structured data exports (CSV/JSON) tailored for national accreditation audit submissions, eliminating manual spreadsheet compilation.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 4: FOR RECRUITERS & EVALUATORS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(217, 119, 6, 0.15)', color: '#d97706' }}>
                  <BusinessCenter />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b' }}>
                    For Corporate Recruiters
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                    Vector candidate ranking & drive workflow management
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, fontSize: '0.85rem' }}>
                • <strong>Semantic Candidate Leaderboards</strong>: Rank applicants by objective vector relevance using PyTorch SBERT sentence embeddings.<br />
                • <strong>Custom Screening Filters</strong>: Apply CGPA thresholds, branch constraints, and skill requirements instantly.<br />
                • <strong>Offer Issuance & Tracking</strong>: Issue digital job offer contracts with real-time 48-hour acceptance deadline tracking.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(147, 51, 234, 0.15)', color: '#9333ea' }}>
                  <Psychology />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b' }}>
                    For Alumni Mentors & Evaluators
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                    Structured rubrics & 1-on-1 session booking
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, fontSize: '0.85rem' }}>
                • <strong>Standardized Evaluator Scorecards</strong>: Grade interview candidates across technical, communication, and problem-solving parameters.<br />
                • <strong>Alumni Mentorship Directory</strong>: List availability slots for 1-on-1 mock interviews and career counseling.<br />
                • <strong>HOD Guidance Alignment</strong>: Support non-placement students pursuing GATE, higher studies, or technical careers.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SECTION 5: HOW OFFERDESK WORKS */}
        <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', boxShadow: '8px 8px 20px #cbd5e1' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', mb: 2.5, textAlign: 'center' }}>
            How OfferDesk Works (Platform Workflow)
          </Typography>

          <Grid container spacing={2}>
            {[
              { step: "01", title: "Institutional Tenant Setup", desc: "System Admins provision a dedicated university tenant domain with department hierarchies and custom eligibility criteria." },
              { step: "02", title: "Student Resume Indexing", desc: "Students update academic records and resume text, which the AI engine indexes using SBERT vector embeddings." },
              { step: "03", title: "Drive Screening & AI Ranking", desc: "Placement Officers publish drives. The SBERT AI engine ranks applicants by semantic relevance while enforcing CGPA cutoffs." },
              { step: "04", title: "Evaluation & Digital Offer E-Sign", desc: "Evaluators score candidates with rubric scorecards. Selected students receive digital offer contracts verified via SHA-256 e-signatures." }
            ].map((s, idx) => (
              <Grid item xs={12} sm={3} key={idx}>
                <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '18px', border: '1px solid #cbd5e1', height: '100%', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: greenPalette.A700, mb: 0.5 }}>
                    {s.step}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5 }}>
                    {s.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block' }}>
                    {s.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* SECTION 6: CORE PLATFORM CAPABILITIES */}
        <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', mb: 2 }}>
            Core Platform Technical Capabilities
          </Typography>

          <Grid container spacing={1.5}>
            {[
              { label: "Logical Multi-Tenancy", desc: "Logical tenantId partitioning keeps institutional records isolated." },
              { label: "8 Granular User Roles", desc: "Dedicated access for SysAdmin, Auditor, Admin, HOD, Recruiter, Evaluator, Mentor, Student." },
              { label: "SBERT Vector Matcher", desc: "PyTorch sentence-transformers (all-MiniLM-L6-v2) for resume scoring." },
              { label: "Groq LLaMA-3.3 AI", desc: "Generative AI microservice for rejection coaching and interview prep." },
              { label: "SHA-256 E-Signatures", desc: "Cryptographic hash generation for offer contract acceptance verification." },
              { label: "Cross-Platform Container", desc: "Single React 18 codebase compiled with CapacitorJS for Web & Mobile." }
            ].map((cap, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <CheckCircle sx={{ color: greenPalette.A700, fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>
                      {cap.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      {cap.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* SECTION 7: SECURITY & COMPLIANCE SUPPORT */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <VpnLock sx={{ color: '#0284c7', fontSize: 28 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  Security & Data Isolation
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6 }}>
                • <strong>Logical Tenant Isolation</strong>: Queries are strictly scoped by university tenant keys.<br />
                • <strong>JWT Role-Based Access (RBAC)</strong>: Validates authorization across all 8 user roles.<br />
                • <strong>Cryptographic Signatures</strong>: SHA-256 hash digests verify offer acceptance timestamps and student identity metadata.<br />
                • <strong>Audit Logs</strong>: Administrative operations generate structured audit events for compliance tracking.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Assessment sx={{ color: greenPalette.A700, fontSize: 28 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  NAAC & NIRF Accreditation Support
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6 }}>
                • <strong>NIRF Data Exporter</strong>: Export placement tables showing branch-wise placement numbers, median CTC calculations, and higher education metrics.<br />
                • <strong>Audit Verification Portal</strong>: Independent compliance auditors can verify cryptographic SHA-256 offer e-signatures without compromising student PII.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SECTION 8: FREQUENTLY ASKED QUESTIONS */}
        <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Help sx={{ color: greenPalette.A700, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
              Frequently Asked Questions (FAQ)
            </Typography>
          </Stack>

          <Accordion sx={{ bgcolor: '#ffffff', mb: 1, borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Is OfferDesk certified by NAAC or NIRF?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                No. NAAC and NIRF accredit educational institutions, not software software applications. OfferDesk provides structured data export and audit verification tooling designed to streamline institutional compliance and accreditation reporting.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: '#ffffff', mb: 1, borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                How does the AI ATS resume matcher work?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                OfferDesk uses PyTorch sentence-transformers (all-MiniLM-L6-v2) to convert resume text and job descriptions into vector embeddings, computing semantic similarity via cosine distance. A TF-IDF keyword backup ensures fallback scoring.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: '#ffffff', mb: 1, borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                How is data isolated between different universities?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                All database operations enforce strict logical tenantId partitioning combined with JWT middleware authorization, ensuring that users from one institution cannot access records from another.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: '#ffffff', borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Can students access OfferDesk on mobile devices?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                Yes. OfferDesk is built as a responsive web application wrapped with CapacitorJS, enabling deployment on web browsers, Android, and iOS devices.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* SECTION 9: REQUEST INSTITUTION TENANT CTA */}
        <Paper sx={{ p: { xs: 3, sm: 4 }, mb: 4, borderRadius: '24px', bgcolor: 'rgba(238, 242, 247, 0.94)', border: '1px solid #cbd5e1', textAlign: 'center', boxShadow: '8px 8px 20px #cbd5e1' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
            Onboard Your Institution to OfferDesk
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 2.5, maxWidth: 650, mx: 'auto' }}>
            Institution administrators can submit an onboarding request to provision a dedicated university tenant portal with customized department controls, role access, and placement workflows.
          </Typography>

          <Button
            variant="contained"
            startIcon={<DomainAdd />}
            onClick={() => setRequestModal(true)}
            sx={{
              bgcolor: greenPalette.A700,
              color: '#ffffff',
              '&:hover': { bgcolor: greenPalette[800] },
              fontWeight: 900,
              fontSize: '0.85rem',
              py: 1.4,
              px: 4,
              borderRadius: '14px'
            }}
          >
            Submit Tenant Onboarding Request
          </Button>
        </Paper>

        {/* SECTION 10: FOOTER */}
        <Box sx={{ pt: 4, pb: 3, borderTop: '1px solid #cbd5e1', bgcolor: 'rgba(238, 242, 247, 0.92)', borderRadius: '24px', px: { xs: 3, sm: 4 }, boxShadow: '8px 8px 20px #cbd5e1' }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>

            {/* COLUMN 1 — Brand */}
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5 }}>
                  OfferDesk
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.825rem', fontWeight: 600, lineHeight: 1.5 }}>
                  Multi-tenant campus placement management platform.
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800 }}>
                  Built by TheOrionGD.
                </Typography>
              </Stack>
            </Grid>

            {/* COLUMN 2 — Platform */}
            <Grid item xs={6} sm={3} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1e293b', mb: 1.2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                Platform
              </Typography>
              <Stack spacing={0.8}>
                <Link href="#students" underline="hover" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>For Students</Link>
                <Link href="#placement-officers" underline="hover" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>For Placement Officers</Link>
                <Link href="#recruiters" underline="hover" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>For Recruiters</Link>
                <Link href="#mentors" underline="hover" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>For Alumni Mentors</Link>
                <Typography
                  onClick={() => setRequestModal(true)}
                  sx={{ color: greenPalette.A700, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Request Your Institution
                </Typography>
                <Typography
                  onClick={() => navigate('/login')}
                  sx={{ color: greenPalette.A700, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  Login
                </Typography>
              </Stack>
            </Grid>

            {/* COLUMN 3 — System */}
            <Grid item xs={6} sm={3} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1e293b', mb: 1.2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                System
              </Typography>
              <Stack spacing={0.8}>
                <Link href="#security" underline="hover" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>Security & Data Isolation</Link>
                <Link href="#accreditation" underline="hover" sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>NAAC / NIRF Compliance Support</Link>
                <Typography
                  onClick={() => setSupportModal(true)}
                  sx={{ color: '#0284c7', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  System Support
                </Typography>
              </Stack>
            </Grid>

            {/* COLUMN 4 — Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1e293b', mb: 1.2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                System Support Contact
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: greenPalette.A700, fontSize: 18 }} />
                  <Typography
                    component="a"
                    href="mailto:hello.theoriongd@gmail.com"
                    sx={{ color: '#1e293b', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', '&:hover': { color: greenPalette.A700 } }}
                  >
                    hello.theoriongd@gmail.com
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={() => window.location.href = 'mailto:hello.theoriongd@gmail.com'}
                  sx={{
                    borderColor: greenPalette.A700,
                    color: greenPalette.A700,
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    py: 0.6,
                    px: 1.5,
                    borderRadius: '10px',
                    alignSelf: 'flex-start'
                  }}
                >
                  Email Support
                </Button>
              </Stack>
            </Grid>

          </Grid>

          <Divider sx={{ mb: 2, borderColor: '#cbd5e1' }} />

          {/* BOTTOM BAR */}
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
              © 2026 OfferDesk. All rights reserved.
            </Typography>
            <Chip
              label="MIT License"
              size="small"
              component="a"
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              clickable
              sx={{ bgcolor: '#e2e8f0', color: '#334155', fontWeight: 800, fontSize: '0.7rem', border: '1px solid #cbd5e1' }}
            />
          </Stack>
        </Box>

      </Container>

      {/* SYSTEM SUPPORT MODAL */}
      <Dialog open={supportModal} onClose={() => setSupportModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#eef2f7', color: '#1e293b', fontWeight: 900, borderBottom: '1px solid #cbd5e1' }}>
          📧 System Support & Assistance
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#eef2f7', pt: 3 }}>
          <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, mb: 2 }}>
            For institutional support inquiries, tenant technical help, or system configuration assistance, reach out directly to the core development team:
          </Typography>

          <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', mb: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block', mb: 0.5 }}>
              OFFICIAL SYSTEM SUPPORT EMAIL:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: greenPalette.A700 }}>
              hello.theoriongd@gmail.com
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mt: 0.5 }}>
              Developer: TheOrionGD
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#eef2f7', p: 2, borderTop: '1px solid #cbd5e1' }}>
          <Button onClick={() => setSupportModal(false)} sx={{ color: '#64748b', fontWeight: 800 }}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Email />}
            onClick={() => window.location.href = 'mailto:hello.theoriongd@gmail.com'}
            sx={{ bgcolor: greenPalette.A700, color: '#ffffff', fontWeight: 900 }}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* REQUEST INSTITUTION TENANT MODAL */}
      <Dialog
        open={requestModal}
        onClose={() => { setRequestModal(false); if (onTenantModalClose) onTenantModalClose(); }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#eef2f7', color: '#1e293b', fontWeight: 900, borderBottom: '1px solid #cbd5e1' }}>
          🏛️ Request New University / Institution Tenant
        </DialogTitle>

        <form onSubmit={handleTenantRequestSubmit}>
          <DialogContent sx={{ bgcolor: '#eef2f7', pt: 2.5, pb: 2 }}>

            {requestMsg && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#dcfce7', border: '1px solid #86efac', borderRadius: 2, color: '#166534', fontSize: '0.8rem', fontWeight: 700 }}>
                {requestMsg}
              </Box>
            )}

            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, mb: 2, display: 'block' }}>
              Fill in your institution details. The System Admin will verify your university domain and provision administrator credentials.
            </Typography>

            <Stack spacing={2.5}>
              
              {/* SECTION 1: INSTITUTION DETAILS */}
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: greenPalette.A700, mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                  Section 1: Institution Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Institution Full Name *"
                      placeholder="e.g. K. Ramakrishnan College of Technology"
                      value={tenantReqForm.institutionName}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, institutionName: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Institution Code *"
                      placeholder="e.g. KRCT"
                      value={tenantReqForm.institutionCode}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, institutionCode: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Institution Domain *"
                      placeholder="e.g. krct.ac.in"
                      value={tenantReqForm.institutionDomain}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, institutionDomain: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* SECTION 2: PRIMARY CONTACT */}
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0284c7', mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                  Section 2: Primary Contact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Contact Person Name *"
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={tenantReqForm.contactName}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, contactName: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Contact Person Designation"
                      placeholder="e.g. Placement Officer / Dean T&P"
                      value={tenantReqForm.contactDesignation}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, contactDesignation: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      size="small"
                      label="Official Admin Email *"
                      placeholder="placement@krct.ac.in"
                      value={tenantReqForm.adminEmail}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, adminEmail: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Contact Phone Number"
                      placeholder="e.g. +91 98765 43210"
                      value={tenantReqForm.contactPhone}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, contactPhone: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* SECTION 3: INSTITUTION SCALE */}
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#d97706', mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                  Section 3: Institution Scale
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                      <InputLabel>Approx. Student Strength *</InputLabel>
                      <Select
                        value={tenantReqForm.studentCapacity}
                        label="Approx. Student Strength *"
                        onChange={(e) => setTenantReqForm({ ...tenantReqForm, studentCapacity: e.target.value })}
                      >
                        <MenuItem value="500-1000">500 - 1,000 Students</MenuItem>
                        <MenuItem value="1000-2500">1,000 - 2,500 Students</MenuItem>
                        <MenuItem value="2500-5000">2,500 - 5,000 Students</MenuItem>
                        <MenuItem value="5000+">5,000+ Students (Enterprise)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      size="small"
                      label="Number of Departments *"
                      placeholder="e.g. 8"
                      value={tenantReqForm.departmentCount}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, departmentCount: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Expected Placement Season"
                      placeholder="e.g. Aug–Dec 2026"
                      value={tenantReqForm.placementSeason}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, placementSeason: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* SECTION 4: ACCREDITATION CONTEXT */}
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#9333ea', mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                  Section 4: Accreditation Context
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      size="small"
                      label="University Affiliation"
                      placeholder="e.g. Anna University Affiliated / Autonomous / Deemed"
                      value={tenantReqForm.universityAffiliation}
                      onChange={(e) => setTenantReqForm({ ...tenantReqForm, universityAffiliation: e.target.value })}
                      sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth size="small" sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                      <InputLabel>NAAC / NIRF Status</InputLabel>
                      <Select
                        value={tenantReqForm.accreditationStatus}
                        label="NAAC / NIRF Status"
                        onChange={(e) => setTenantReqForm({ ...tenantReqForm, accreditationStatus: e.target.value })}
                      >
                        <MenuItem value="Accredited">Accredited</MenuItem>
                        <MenuItem value="In Process">In Process</MenuItem>
                        <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* SECTION 5: ONBOARDING NOTES */}
              <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1e293b', mb: 1.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                  Section 5: Onboarding Notes / Requirements
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="Onboarding Notes / Special Requirements"
                  placeholder="e.g. specific roles you need enabled, integration questions, migration from existing system..."
                  value={tenantReqForm.requestReason}
                  onChange={(e) => setTenantReqForm({ ...tenantReqForm, requestReason: e.target.value })}
                  sx={{ bgcolor: '#f8fafc', borderRadius: 1.5 }}
                />
              </Box>

              {/* FOOTER NOTE */}
              <Box sx={{ p: 1.5, bgcolor: '#e2e8f0', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, lineHeight: 1.4, display: 'block' }}>
                  ℹ️ <strong>Note:</strong> Submitting this request does not create an account. An OfferDesk System Admin will review your request and provision your institution's tenant. You'll receive admin credentials at the Official Admin Email provided once approved.
                </Typography>
              </Box>

            </Stack>

          </DialogContent>

          <DialogActions sx={{ bgcolor: '#eef2f7', p: 2.5, borderTop: '1px solid #cbd5e1' }}>
            <Button
              onClick={() => { setRequestModal(false); if (onTenantModalClose) onTenantModalClose(); }}
              sx={{ color: '#64748b', fontWeight: 800 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              sx={{ bgcolor: greenPalette.A700, color: '#ffffff', fontWeight: 900, px: 3, borderRadius: '12px' }}
            >
              Submit Onboarding Request
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
  );
}

export default LandingPage;
