import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CapacitorService } from './services/capacitorService';
import { LocalNotificationService } from './services/localNotificationService';
import { AppBar, Toolbar, Typography, Button, Box, Select, FormControl, Avatar, Stack, IconButton, Tooltip, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Badge, MenuItem } from '@mui/material';
import { 
  School, 
  BusinessCenter, 
  Security, 
  AccountBalance, 
  RateReview, 
  Psychology, 
  Home,
  NotificationsActive,
  MenuBook,
  VpnKey,
  Logout,
  Menu as MenuIcon,
  Settings,
  Person,
  FilterList,
  Gavel,
  Forum,
  Favorite,
  Palette,
  Close,
  DomainAdd,
  Assessment,
  Search,
  VerifiedUser
} from '@mui/icons-material';

import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import SplashLoader from './components/SplashLoader';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import NoticeBoard from './components/NoticeBoard';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import HubPage from './components/HubPage';
import Forbidden403Page from './components/Forbidden403Page';
import NotFound404Page from './components/NotFound404Page';
import EmailVerificationPage from './components/EmailVerificationPage';
import ExitLogoutPage from './components/ExitLogoutPage';
import MuiDesignShowcase from './components/MuiDesignShowcase';

// Role Directory Components & Pages
import PlacementFiltering from './roles/tenant_admin/PlacementFiltering';
import PlacementAcceptance from './roles/student/PlacementAcceptance';
import DriveSpaceChat from './roles/student/DriveSpaceChat';
import NonPlacementHub from './roles/dept_coordinator/NonPlacementHub';

// 8 Role Directory Modules
import StudentDashboard from './roles/student/StudentDashboard';
import StudentWellnessSuite from './roles/student/StudentWellnessSuite';
import StudentResumeATS from './roles/student/StudentResumeATS';

import RecruiterDashboard from './roles/recruiter/RecruiterDashboard';
import RecruiterCandidateSearch from './roles/recruiter/RecruiterCandidateSearch';

import TenantAdminDashboard from './roles/tenant_admin/TenantAdminDashboard';
import TenantNirfExporter from './roles/tenant_admin/TenantNirfExporter';

import DeptCoordinatorDashboard from './roles/dept_coordinator/DeptCoordinatorDashboard';
import DeptBranchClearance from './roles/dept_coordinator/DeptBranchClearance';

import InterviewEvaluatorPanel from './roles/evaluator/InterviewEvaluatorPanel';
import EvaluatorRubricScorecard from './roles/evaluator/EvaluatorRubricScorecard';

import MentorHub from './roles/mentor/MentorHub';
import MentorSessionBooking from './roles/mentor/MentorSessionBooking';

import SysAdminPortal from './roles/sysadmin/SysAdminPortal';
import SysAdminTenantProvisioning from './roles/sysadmin/SysAdminTenantProvisioning';

import ComplianceAuditorPortal from './roles/auditor/ComplianceAuditorPortal';
import AuditorSha256Verifier from './roles/auditor/AuditorSha256Verifier';

import { greenPalette } from './theme';
import appIconImg from './assets/app-icon.png';

/**
 * Strict Auth & Role Guard Component
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== 'sysadmin') {
    return <Navigate to="/403" replace />;
  }

  return children;
}

/**
 * Neumorphic Soft-3D Top Header Bar
 */
function MobileTopHeader({ onOpenDrawer }) {
  const { currentTenant } = useTenant();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#eef2f7', borderBottom: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff', elevation: 0 }}>
      <Toolbar size="small" sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 2.5 }, minHeight: 60 }}>
        
        {/* Left: Brand Logo & Title */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar src={appIconImg} alt="OfferDesk Logo" sx={{ width: 34, height: 34, boxShadow: '4px 4px 10px #d1d9e6, -4px -4px 10px #ffffff' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1e293b', letterSpacing: -0.5, fontSize: '1rem' }}>
              OfferDesk <span style={{ color: greenPalette.A700 }}>App</span>
            </Typography>
          </Link>
        </Stack>

        {/* Right: Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Campus Notices">
            <IconButton size="small" onClick={() => navigate('/notices')} sx={{ color: '#475569', boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff', bgcolor: '#eef2f7' }}>
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsActive fontSize="small" sx={{ color: '#ef4444' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={onOpenDrawer} sx={{ color: '#1e293b', boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff', bgcolor: '#eef2f7' }}>
            <MenuIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

/**
 * Neumorphic Soft Light Drawer Menu Bar with "Request Institution Tenant"
 */
function NavigationMenuDrawer({ open, onClose, onRequestTenantOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { tenants, currentTenant, switchTenant } = useTenant();

  const menuItems = [
    { title: 'Home Landing Page', icon: <Home sx={{ color: greenPalette.A700 }} />, route: '/' },
    { title: 'Request Institution Tenant', icon: <DomainAdd sx={{ color: greenPalette.A700 }} />, action: 'REQUEST_TENANT' },
    { title: 'Student Suite & ATS', icon: <School sx={{ color: greenPalette.A700 }} />, route: '/student/dashboard', role: 'student' },
    { title: 'Student Resume ATS', icon: <School sx={{ color: greenPalette.A700 }} />, route: '/student/ats', role: 'student' },
    { title: 'Candidate Filtering', icon: <FilterList sx={{ color: greenPalette.A700 }} />, route: '/filtering', role: 'tenant_admin' },
    { title: 'Offer E-Signatures', icon: <Gavel sx={{ color: '#d97706' }} />, route: '/acceptance', role: 'student' },
    { title: 'Drive Spaces & Chat', icon: <Forum sx={{ color: greenPalette.A700 }} />, route: '/spaces', role: 'student' },
    { title: '24h Notice Board', icon: <NotificationsActive sx={{ color: '#ef4444' }} />, route: '/notices' },
    { title: 'Non-Placement Hub', icon: <MenuBook sx={{ color: '#0284c7' }} />, route: '/non-placement', role: 'dept_coordinator' },
    { title: 'Student Wellness Suite', icon: <Favorite sx={{ color: '#db2777' }} />, route: '/wellness', role: 'student' },
    { title: 'Recruiter Dashboard', icon: <BusinessCenter sx={{ color: greenPalette.A700 }} />, route: '/recruiter/dashboard', role: 'recruiter' },
    { title: 'Recruiter Candidate Search', icon: <BusinessCenter sx={{ color: greenPalette.A700 }} />, route: '/recruiter/search', role: 'recruiter' },
    { title: 'Placement Officer Admin', icon: <Security sx={{ color: greenPalette.A700 }} />, route: '/tenant-admin', role: 'tenant_admin' },
    { title: 'NIRF Accreditation Exporter', icon: <Security sx={{ color: greenPalette.A700 }} />, route: '/tenant-admin/nirf', role: 'tenant_admin' },
    { title: 'Faculty / HOD Panel', icon: <AccountBalance sx={{ color: greenPalette.A700 }} />, route: '/dept-coordinator', role: 'dept_coordinator' },
    { title: 'HOD Branch Clearance', icon: <AccountBalance sx={{ color: greenPalette.A700 }} />, route: '/dept-coordinator/clearance', role: 'dept_coordinator' },
    { title: 'Interview Evaluator', icon: <RateReview sx={{ color: greenPalette.A700 }} />, route: '/evaluator', role: 'evaluator' },
    { title: 'Evaluator Scorecard', icon: <RateReview sx={{ color: greenPalette.A700 }} />, route: '/evaluator/scorecard', role: 'evaluator' },
    { title: 'Mentor Hub', icon: <Psychology sx={{ color: greenPalette.A700 }} />, route: '/mentor', role: 'mentor' },
    { title: 'Mentorship Session Booking', icon: <Psychology sx={{ color: greenPalette.A700 }} />, route: '/mentor/booking', role: 'mentor' },
    { title: 'SaaS Super Admin', icon: <Security sx={{ color: greenPalette.A700 }} />, route: '/sysadmin', role: 'sysadmin' },
    { title: 'Tenant Provisioning', icon: <Security sx={{ color: greenPalette.A700 }} />, route: '/sysadmin/provision', role: 'sysadmin' },
    { title: 'Compliance Auditor', icon: <Security sx={{ color: greenPalette.A700 }} />, route: '/auditor', role: 'auditor' },
    { title: 'SHA-256 Hash Verifier', icon: <Security sx={{ color: greenPalette.A700 }} />, route: '/auditor/verifier', role: 'auditor' },
    { title: 'Material UI Showcase', icon: <Palette sx={{ color: greenPalette.A700 }} />, route: '/showcase' },
    { title: 'Settings', icon: <Settings sx={{ color: '#64748b' }} />, route: '/settings' },
    { title: 'My Profile', icon: <Person sx={{ color: greenPalette.A700 }} />, route: '/profile' }
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (!user) {
      return item.route === '/' || item.action === 'REQUEST_TENANT' || item.route === '/login';
    }
    if (!item.role) return true;
    if (user.role === 'sysadmin') return true;
    return item.role === user.role;
  });

  const handleNav = (item) => {
    onClose();
    if (item.action === 'REQUEST_TENANT') {
      if (onRequestTenantOpen) onRequestTenantOpen();
      else navigate('/?requestTenant=true');
    } else if (!user && item.route !== '/') {
      navigate('/login');
    } else {
      navigate(item.route);
    }
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 310,
          bgcolor: '#eef2f7',
          color: '#1e293b',
          borderLeft: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '-10px 0 30px #cbd5e1',
          p: 2.5
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={appIconImg} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
              OfferDesk Mobile
            </Typography>
            <Typography variant="caption" sx={{ color: user ? greenPalette[800] : '#64748b', fontWeight: 700 }}>
              {user ? `Role: ${user.role?.toUpperCase()}` : 'Guest Visitor Mode'}
            </Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: '#64748b', bgcolor: '#eef2f7', boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff' }}>
          <Close fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ my: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, mb: 0.5, display: 'block' }}>
          INSTITUTION TENANT SELECTOR
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={currentTenant?.tenantId || ''}
            onChange={(e) => switchTenant(e.target.value)}
            className="neu-input"
            sx={{
              bgcolor: '#eef2f7',
              color: '#1e293b',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: 3
            }}
          >
            {tenants.map(t => (
              <MenuItem key={t.tenantId} value={t.tenantId} sx={{ fontSize: '0.75rem' }}>
                {t.code} - {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 1, borderColor: 'rgba(0,0,0,0.06)' }} />

      <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
        {visibleMenuItems.map((item, idx) => (
          <ListItem key={idx} disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton 
              onClick={() => handleNav(item)}
              sx={{ 
                borderRadius: 3, 
                py: 1,
                bgcolor: '#eef2f7',
                boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
                '&:hover': { bgcolor: '#e2e8f0' } 
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(0,0,0,0.06)' }} />

      {user ? (
        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={() => { logout(); navigate('/login'); onClose(); }}
          sx={{ fontWeight: 800, mt: 1, borderRadius: 9999 }}
        >
          Sign Out ({user.role})
        </Button>
      ) : (
        <Button
          fullWidth
          size="small"
          className="neu-btn-primary"
          startIcon={<VpnKey />}
          onClick={() => { navigate('/login'); onClose(); }}
          sx={{ fontWeight: 800, mt: 1, py: 1.2, fontSize: '0.85rem' }}
        >
          Sign In to Campus App
        </Button>
      )}
    </Drawer>
  );
}

/**
 * Role-Specific Customized Bottom Navigation Bar
 */
function MobileBottomNav({ onRequestTenantOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  // Custom Role-Specific Bottom Navigation Items
  const getNavConfig = () => {
    // 1. GUEST / LANDING PAGE NAVIGATION
    if (!user) {
      return [
        { label: 'Home', icon: <Home />, path: '/' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Request Tenant', icon: <DomainAdd />, action: 'REQUEST_TENANT' },
        { label: 'Sign In', icon: <VpnKey />, path: '/login' }
      ];
    }

    // 2. STUDENT ROLE NAVIGATION
    if (role === 'student') {
      return [
        { label: 'Drives', icon: <School />, path: '/student/dashboard' },
        { label: 'ATS Resume', icon: <Assessment />, path: '/student/ats' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Wellness', icon: <Favorite />, path: '/wellness' },
        { label: 'Profile', icon: <Person />, path: '/profile' }
      ];
    }

    // 3. MENTOR ROLE NAVIGATION
    if (role === 'mentor') {
      return [
        { label: 'Mentor Hub', icon: <Psychology />, path: '/mentor' },
        { label: 'Booking', icon: <Forum />, path: '/mentor/booking' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Settings', icon: <Settings />, path: '/settings' },
        { label: 'Profile', icon: <Person />, path: '/profile' }
      ];
    }

    // 4. PLACEMENT CELL OFFICER (TENANT ADMIN) NAVIGATION
    if (role === 'tenant_admin') {
      return [
        { label: 'Dashboard', icon: <Security />, path: '/tenant-admin' },
        { label: 'Filtering', icon: <FilterList />, path: '/filtering' },
        { label: 'NIRF Report', icon: <Assessment />, path: '/tenant-admin/nirf' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Settings', icon: <Settings />, path: '/settings' }
      ];
    }

    // 5. FACULTY / HOD (DEPT COORDINATOR) NAVIGATION
    if (role === 'dept_coordinator') {
      return [
        { label: 'HOD Overview', icon: <AccountBalance />, path: '/dept-coordinator' },
        { label: 'Clearance', icon: <VerifiedUser />, path: '/dept-coordinator/clearance' },
        { label: 'Non-Placement', icon: <MenuBook />, path: '/non-placement' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Settings', icon: <Settings />, path: '/settings' }
      ];
    }

    // 6. CORPORATE RECRUITER NAVIGATION
    if (role === 'recruiter') {
      return [
        { label: 'Dashboard', icon: <BusinessCenter />, path: '/recruiter/dashboard' },
        { label: 'Candidates', icon: <Search />, path: '/recruiter/search' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Profile', icon: <Person />, path: '/profile' }
      ];
    }

    // 7. SYSTEM ADMIN NAVIGATION
    if (role === 'sysadmin') {
      return [
        { label: 'SysAdmin', icon: <Security />, path: '/sysadmin' },
        { label: 'Provision', icon: <DomainAdd />, path: '/sysadmin/provision' },
        { label: 'Audit', icon: <VerifiedUser />, path: '/auditor' },
        { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
        { label: 'Settings', icon: <Settings />, path: '/settings' }
      ];
    }

    // Default Fallback Config
    return [
      { label: 'Home', icon: <Home />, path: '/' },
      { label: 'Notices', icon: <NotificationsActive />, path: '/notices' },
      { label: 'Profile', icon: <Person />, path: '/profile' }
    ];
  };

  const navConfig = getNavConfig();

  const handleAction = (item) => {
    if (item.action === 'REQUEST_TENANT') {
      if (onRequestTenantOpen) onRequestTenantOpen();
      else navigate('/?requestTenant=true');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100, 
        display: 'flex', 
        justifyContent: 'center',
        pb: 1.5,
        px: 1
      }}
    >
      <Box 
        className="neu-floating-nav"
        sx={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          px: 1.5,
          py: 0.8,
          bgcolor: '#eef2f7',
          borderRadius: 9999,
          boxShadow: '8px 8px 20px #cbd5e1, -8px -8px 20px #ffffff',
          border: '1px solid rgba(255, 255, 255, 0.9)'
        }}
      >
        {navConfig.map((item, idx) => {
          const isActive = item.path && location.pathname === item.path;

          return (
            <Tooltip key={idx} title={item.label}>
              <IconButton 
                onClick={() => handleAction(item)}
                sx={{ 
                  color: isActive ? greenPalette.A700 : '#475569',
                  boxShadow: isActive 
                    ? 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff' 
                    : '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
                  bgcolor: '#eef2f7',
                  p: 1.2
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}

function MainAppContent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);

  useEffect(() => {
    CapacitorService.initializeAppNativeUI();
    CapacitorService.initBackButtonListener();
    LocalNotificationService.initNotificationChannels();
    LocalNotificationService.requestNotificationPermission();

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <SplashLoader message="Booting Neumorphic Campus App..." subtitle="Material UI & Native Capacitor Engine" />;
  }

  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: '#dce4ec', color: '#1e293b', display: 'flex', justifyContent: 'center', py: { xs: 0, sm: 2 } }}>
        
        {/* MOBILE RESPONSIVE CONTAINER FRAME */}
        <Box 
          sx={{ 
            width: { xs: '100%', sm: 440 },
            maxWidth: '100vw',
            minHeight: '100vh',
            bgcolor: '#eef2f7',
            boxShadow: { sm: '16px 16px 40px #b8c4d4, -16px -16px 40px #ffffff' },
            borderRadius: { xs: 0, sm: '36px' },
            overflowX: 'hidden',
            overflowY: 'visible',
            border: { sm: '1px solid rgba(255, 255, 255, 0.9)' },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            pb: 10
          }}
        >
          {/* TOP HEADER */}
          <MobileTopHeader 
            onOpenDrawer={() => setDrawerOpen(true)} 
          />

          {/* MENU DRAWER */}
          <NavigationMenuDrawer 
            open={drawerOpen} 
            onClose={() => setDrawerOpen(false)}
            onRequestTenantOpen={() => setTenantModalOpen(true)}
          />

          {/* MAIN ROUTES BODY */}
          <Box component="main" sx={{ flex: 1, px: { xs: 1, sm: 2 }, pt: 2, overflowX: 'hidden' }}>
            <Routes>
              {/* Public Flow Routes */}
              <Route path="/" element={<LandingPage isTenantModalOpen={tenantModalOpen} onTenantModalClose={() => setTenantModalOpen(false)} />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Student Role Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/ats" element={<ProtectedRoute allowedRoles={['student']}><StudentResumeATS /></ProtectedRoute>} />
              <Route path="/wellness" element={<ProtectedRoute allowedRoles={['student']}><StudentWellnessSuite /></ProtectedRoute>} />

              {/* Recruiter Role Routes */}
              <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
              <Route path="/recruiter/search" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterCandidateSearch /></ProtectedRoute>} />

              {/* Placement Admin Role Routes */}
              <Route path="/tenant-admin" element={<ProtectedRoute allowedRoles={['tenant_admin']}><TenantAdminDashboard /></ProtectedRoute>} />
              <Route path="/tenant-admin/nirf" element={<ProtectedRoute allowedRoles={['tenant_admin']}><TenantNirfExporter /></ProtectedRoute>} />

              {/* Faculty Coordinator Role Routes */}
              <Route path="/dept-coordinator" element={<ProtectedRoute allowedRoles={['dept_coordinator']}><DeptCoordinatorDashboard /></ProtectedRoute>} />
              <Route path="/dept-coordinator/clearance" element={<ProtectedRoute allowedRoles={['dept_coordinator']}><DeptBranchClearance /></ProtectedRoute>} />

              {/* Interview Evaluator Role Routes */}
              <Route path="/evaluator" element={<ProtectedRoute allowedRoles={['evaluator']}><InterviewEvaluatorPanel /></ProtectedRoute>} />
              <Route path="/evaluator/scorecard" element={<ProtectedRoute allowedRoles={['evaluator']}><EvaluatorRubricScorecard /></ProtectedRoute>} />

              {/* Mentor Role Routes */}
              <Route path="/mentor" element={<ProtectedRoute allowedRoles={['mentor']}><MentorHub /></ProtectedRoute>} />
              <Route path="/mentor/booking" element={<ProtectedRoute allowedRoles={['mentor']}><MentorSessionBooking /></ProtectedRoute>} />

              {/* SaaS Super Admin Role Routes */}
              <Route path="/sysadmin" element={<ProtectedRoute allowedRoles={['sysadmin']}><SysAdminPortal /></ProtectedRoute>} />
              <Route path="/sysadmin/provision" element={<ProtectedRoute allowedRoles={['sysadmin']}><SysAdminTenantProvisioning /></ProtectedRoute>} />

              {/* Compliance Auditor Role Routes */}
              <Route path="/auditor" element={<ProtectedRoute allowedRoles={['auditor']}><ComplianceAuditorPortal /></ProtectedRoute>} />
              <Route path="/auditor/verifier" element={<ProtectedRoute allowedRoles={['auditor']}><AuditorSha256Verifier /></ProtectedRoute>} />

              {/* General Protected System Pages */}
              <Route path="/showcase" element={<MuiDesignShowcase />} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/hub" element={<ProtectedRoute><HubPage /></ProtectedRoute>} />
              <Route path="/notices" element={<ProtectedRoute><NoticeBoard /></ProtectedRoute>} />
              <Route path="/verify-email" element={<ProtectedRoute><EmailVerificationPage /></ProtectedRoute>} />
              <Route path="/filtering" element={<ProtectedRoute allowedRoles={['tenant_admin']}><PlacementFiltering /></ProtectedRoute>} />
              <Route path="/acceptance" element={<ProtectedRoute allowedRoles={['student']}><PlacementAcceptance /></ProtectedRoute>} />
              <Route path="/spaces" element={<ProtectedRoute allowedRoles={['student']}><DriveSpaceChat /></ProtectedRoute>} />
              <Route path="/non-placement" element={<ProtectedRoute allowedRoles={['dept_coordinator']}><NonPlacementHub /></ProtectedRoute>} />

              {/* Utility Pages */}
              <Route path="/logout" element={<ExitLogoutPage />} />
              <Route path="/403" element={<Forbidden403Page />} />
              <Route path="/404" element={<NotFound404Page />} />

              <Route path="*" element={<NotFound404Page />} />
            </Routes>
          </Box>

          {/* ROLE-CUSTOMIZED FLOATING BOTTOM NAVIGATION BAR */}
          <MobileBottomNav onRequestTenantOpen={() => setTenantModalOpen(true)} />

        </Box>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;
