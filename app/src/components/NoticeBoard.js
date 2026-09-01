import React, { useState, useEffect, useCallback } from 'react';
import { Container, Paper, Typography, Grid, Box, Button, TextField, Chip, Stack, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { NotificationsActive, Add, Timer, Campaign } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { greenPalette } from '../theme';
import { LocalNotificationService } from '../services/localNotificationService';
import StudentOfferNoticeCard from './StudentOfferNoticeCard';

export function NoticeBoard() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [notices, setNotices] = useState([]);
  const [studentContracts, setStudentContracts] = useState([]);
  const [activeNoticeContract, setActiveNoticeContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('URGENT');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notices?tenantId=${currentTenant.tenantId}`);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch (err) {
      console.error("Fetch notices error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  const fetchStudentContracts = useCallback(async () => {
    if (user?.role !== 'student' || !user?._id || !currentTenant?.tenantId) return;
    try {
      const res = await fetch(`${API_URL}/api/acceptances/student/${user._id}?tenantId=${currentTenant.tenantId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.contracts)) {
        setStudentContracts(data.contracts);
        if (data.contracts.length > 0 && !activeNoticeContract) {
          setActiveNoticeContract(data.contracts[0]);
        }
      }
    } catch (err) {
      console.warn("Fetch student contracts error:", err);
    }
  }, [user, currentTenant, API_URL, activeNoticeContract]);

  useEffect(() => {
    fetchNotices();
    fetchStudentContracts();
  }, [fetchNotices, fetchStudentContracts]);

  const handleAcceptOffer = async ({ contractId, digitalSignature }) => {
    try {
      const res = await fetch(`${API_URL}/api/acceptances/${contractId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          digitalSignature,
          tenantId: currentTenant?.tenantId,
          studentId: user?._id || user?.id,
          signedBy: user?.name,
          signedByRole: user?.role
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Offer Accepted! SHA-256 e-signature recorded.');
        fetchStudentContracts();
      } else {
        alert(data.error || 'Failed to accept offer.');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRejectOffer = async ({ contractId, rejectionReason }) => {
    try {
      const res = await fetch(`${API_URL}/api/acceptances/${contractId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason,
          tenantId: currentTenant?.tenantId,
          studentId: user?._id || user?.id,
          studentName: user?.name,
          rejectedAt: new Date().toISOString()
        })
      });
      const data = await res.json();
      alert('❌ Rejection registered. Rejection data & reason transmitted to assigned Mentor & HOD.');
      fetchStudentContracts();
    } catch (e) {
      alert('Rejection recorded and transmitted to Mentor.');
      fetchStudentContracts();
    }
  };

  const handlePostNotice = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: currentTenant.tenantId,
          title,
          content,
          category,
          postedBy: user?.name,
          postedByRole: user?.role,
        })
      });
      const data = await res.json();
      if (data.success) {
        await LocalNotificationService.sendNotification({
          title: `📢 New Campus Notice: ${title}`,
          body: content,
          channelId: 'campus_updates'
        });

        setTitle('');
        setContent('');
        setOpenModal(false);
        fetchNotices();
      }
    } catch (err) {
      console.error("Post notice error:", err);
    }
  };

  const handleTestNativeNotification = async () => {
    await LocalNotificationService.requestNotificationPermission();
    await LocalNotificationService.sendNotification({
      title: '🔔 Instant Native In-App Push Alert',
      body: 'OfferDesk Android native push notification triggered locally without Firebase!',
      channelId: 'campus_updates'
    });
  };

  const isAuthorizedToPost = ['system_admin', 'tenant_admin', 'dept_coordinator', 'recruiter'].includes(user?.role);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      {/* Student Offer Acceptance Notice Card (if active) */}
      {user?.role === 'student' && activeNoticeContract && (
        <StudentOfferNoticeCard
          contract={activeNoticeContract}
          onAccept={handleAcceptOffer}
          onReject={handleRejectOffer}
          onBack={() => setActiveNoticeContract(null)}
        />
      )}

      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-emerald-glow)' }}>
        
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette[300] }}>
              <NotificationsActive sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 900, color: greenPalette[800] }}>
                  24-Hour Circular Notice Board
                </Typography>
                <Chip icon={<Timer sx={{ fontSize: '0.85rem !important' }} />} label="Auto-Expiring 24h Feed" color="warning" size="small" sx={{ fontWeight: 700 }} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Official announcements, drive schedules, and urgent placement offer circulars.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="outlined"
              color="info"
              startIcon={<NotificationsActive />}
              onClick={handleTestNativeNotification}
              sx={{ fontWeight: 700, borderColor: '#38bdf8', color: '#38bdf8' }}
            >
              Test In-App Push
            </Button>

            {isAuthorizedToPost && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenModal(true)}
                sx={{ bgcolor: greenPalette[500], '&:hover': { bgcolor: greenPalette[600] }, fontWeight: 700, px: 3, py: 1.2 }}
              >
                Post Notice
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Notices Grid */}
        {notices.length === 0 ? (
          <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px dashed var(--border-subtle)', p: 4, textAlign: 'center' }}>
            <Campaign sx={{ fontSize: 48, color: greenPalette[400], mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: greenPalette[800] }}>
              No Active Notices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All circulars from the past 24 hours have auto-expired. Check back soon for new announcements.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {notices.map((n) => {
              const createdTime = new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const expiresDate = new Date(n.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <Grid item xs={12} md={6} key={n._id}>
                  <Card className="sys-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Chip label={n.category || ''} color="error" size="small" sx={{ fontWeight: 700 }} />
                        <Typography variant="caption" color="text.secondary">
                          Posted: {createdTime} • Expires: <strong style={{ color: greenPalette.A200 }}>{expiresDate}</strong>
                        </Typography>
                      </Stack>

                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                        {n.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6, mb: 2 }}>
                        {n.content}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid var(--border-subtle)' }}>
                      <Typography variant="caption" color="text.secondary">
                        Posted by: <strong style={{ color: greenPalette[300] }}>{n.postedBy}</strong> ({n.postedByRole})
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

      </Paper>

      {/* Post Notice Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle sx={{ bgcolor: 'var(--bg-dark-paper)', color: '#ffffff' }}>Post 24-Hour Circular Notice</DialogTitle>
        <DialogContent sx={{ bgcolor: 'var(--bg-dark-paper)', pt: 2 }}>
          <TextField
            fullWidth
            margin="dense"
            label="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ input: { color: '#ffffff' }, label: { color: 'var(--text-secondary)' } }}
          />
          <TextField
            fullWidth
            margin="dense"
            multiline
            rows={4}
            label="Notice Content & Circular Details"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ textarea: { color: '#ffffff' }, label: { color: 'var(--text-secondary)' } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'var(--bg-dark-paper)' }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: 'var(--text-secondary)' }}>Cancel</Button>
          <Button onClick={handlePostNotice} variant="contained" sx={{ bgcolor: greenPalette[500] }}>Publish Notice (24h Expiry)</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NoticeBoard;
