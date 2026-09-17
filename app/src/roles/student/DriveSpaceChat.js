import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, Box, Button, TextField, Chip, Stack, Card, CardContent, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import { Chat, Add, Send, SmartToy, Groups } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { greenPalette } from '../../theme';
import PersonalizedAiChat from '../../components/PersonalizedAiChat';

export function DriveSpaceChat() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  // Chat Mode Switcher: 0: Traditional Role-Role Drive Spaces, 1: Personalized AI Assistant
  const [chatMode, setChatMode] = useState(0);

  const [spaces, setSpaces] = useState([]);
  const [activeSpace, setActiveSpace] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [openSpaceModal, setOpenSpaceModal] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDesc, setSpaceDesc] = useState('');

  // AI Drive Prep state
  const [aiPrep, setAiPrep] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchSpaces = async () => {
    try {
      const res = await fetch(`${API_URL}/api/spaces?tenantId=${currentTenant.tenantId}&userId=${user?._id}&role=${user?.role}`);
      const data = await res.json();
      if (data.success) {
        setSpaces(data.spaces || []);
        if (data.spaces.length > 0 && !activeSpace) {
          setActiveSpace(data.spaces[0]);
        }
      }
    } catch (err) {
      console.error("Fetch spaces error:", err);
    }
  };

  const fetchMessages = async (spaceId) => {
    try {
      const res = await fetch(`${API_URL}/api/spaces/${spaceId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [currentTenant, user]);

  useEffect(() => {
    if (activeSpace) {
      fetchMessages(activeSpace.spaceId);
    }
  }, [activeSpace]);

  const handleCreateSpace = async () => {
    if (!spaceName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/spaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: currentTenant.tenantId,
          name: spaceName,
          description: spaceDesc,
          hodId: user?._id || user?.id,
          hodName: user?.name,
          userRole: user?.role
        })
      });
      const data = await res.json();
      if (data.success) {
        setSpaceName('');
        setSpaceDesc('');
        setOpenSpaceModal(false);
        fetchSpaces();
      } else {
        alert(data.error || '');
      }
    } catch (err) {
      console.error("Create space error:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMsg.trim() || !activeSpace) return;
    try {
      const res = await fetch(`${API_URL}/api/spaces/${activeSpace.spaceId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: currentTenant.tenantId,
          senderId: user?._id || user?.id,
          senderName: user?.name,
          senderRole: user?.role,
          message: newMsg
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewMsg('');
        fetchMessages(activeSpace.spaceId);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleGenerateAiPrep = async () => {
    if (!activeSpace || !activeSpace.jobId) return;
    setAiLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const res = await fetch(`${API_URL}/api/ai/prep-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: activeSpace.jobId
        })
      });
      const data = await res.json();
      if (data.success && data.prepMaterial) {
        setAiPrep(data.prepMaterial);
      } else {
        console.error("AI Prep error:", data.error);
      }
    } catch (err) {
      console.error("AI Prep error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>
      
      {/* Top 2-Way Chat Mode Switcher Header */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-subtle)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
              Dual Collaboration & AI Intelligence Hub
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Switch between Role-to-Role Drive Spaces and your Personalized AI Career Assistant.
            </Typography>
          </Box>

          <Tabs 
            value={chatMode} 
            onChange={(e, nv) => setChatMode(nv)}
            sx={{
              bgcolor: 'var(--bg-dark-paper)',
              borderRadius: 3,
              p: 0.5,
              '& .MuiTab-root': { color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.8rem', borderRadius: 2 },
              '& .Mui-selected': { color: '#ffffff', bgcolor: greenPalette[600] },
              '& .MuiTabs-indicator': { display: 'none' }
            }}
          >
            <Tab icon={<Groups />} iconPosition="start" label="1. Role-Role Drive Spaces" />
            <Tab icon={<SmartToy />} iconPosition="start" label="2. Personalized AI Bot" />
          </Tabs>
        </Stack>
      </Paper>

      {/* MODE 1: TRADITIONAL PREEXISTING ROLE-ROLE DRIVE SPACES CHAT */}
      {chatMode === 0 && (
        <Grid container spacing={3}>
          {/* Left Spaces Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-subtle)', minHeight: 600 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  HOD Drive Spaces
                </Typography>

                {user?.role === 'dept_coordinator' && (
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<Add />}
                    onClick={() => setOpenSpaceModal(true)}
                    sx={{ bgcolor: greenPalette[500], '&:hover': { bgcolor: greenPalette[600] }, fontWeight: 700 }}
                  >
                    Create Space
                  </Button>
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary" paragraph>
                Hierarchical Drive Communication: HOD ↔ Mentors / Co-Admins ↔ Students.
              </Typography>

              <Stack spacing={1.5}>
                {spaces.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No drive spaces found.</Typography>
                ) : (
                  spaces.map((sp) => (
                    <Card 
                      key={sp.spaceId}
                      onClick={() => setActiveSpace(sp)}
                      sx={{ 
                        bgcolor: activeSpace?.spaceId === sp.spaceId ? 'rgba(76, 175, 80, 0.15)' : 'var(--bg-dark-paper)', 
                        border: `1px solid ${activeSpace?.spaceId === sp.spaceId ? greenPalette[500] : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        transition: 'var(--transition-system)'
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                          {sp.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Created by HOD: {sp.hodName}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Active Space Chat & AI Prep */}
          <Grid item xs={12} md={8}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-emerald-glow)', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
              {activeSpace ? (
                <>
                  {/* Active Space Top Bar */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 2, borderBottom: '1px solid var(--border-subtle)', mb: 2 }}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h5" sx={{ fontWeight: 800, color: greenPalette[300] }}>
                          {activeSpace.name}
                        </Typography>
                        <Chip label="Google Chat Hierarchy Space" size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette.A200, fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {activeSpace.description || ''}
                      </Typography>
                    </Box>

                    <Button 
                      variant="outlined"
                      size="small"
                      startIcon={<SmartToy sx={{ color: greenPalette.A400 }} />}
                      onClick={handleGenerateAiPrep}
                      disabled={aiLoading}
                      sx={{ borderColor: greenPalette[500], color: greenPalette[300] }}
                    >
                      {aiLoading ? 'Generating...' : 'AI Drive Study Assistant'}
                    </Button>
                  </Stack>

                  {/* AI Drive Study Assistant Card */}
                  {aiPrep && (
                    <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.9)', border: `1px solid ${greenPalette[500]}`, mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: greenPalette.A200, mb: 1 }}>
                          🤖 AI Pre-Interview Technical Roadmap for {aiPrep.company}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" paragraph>
                          Topics: {aiPrep.technicalTopics.join(' • ')}
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: 'var(--border-subtle)' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: greenPalette[300] }}>
                          Sample Question: {aiPrep.sampleQuestions[0]?.question}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Messages Feed */}
                  <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, p: 2, bgcolor: 'var(--bg-dark-paper)', borderRadius: 2, maxHeight: 350 }}>
                    {messages.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" align="center">
                        No messages yet in this Drive Space channel.
                      </Typography>
                    ) : (
                      messages.map((m) => (
                        <Box key={m._id} sx={{ mb: 1.5, textAlign: m.senderId === user._id ? 'right' : 'left' }}>
                          <Typography variant="caption" sx={{ color: greenPalette[300], fontWeight: 700, mr: 1 }}>
                            {m.senderName} ({m.senderRole})
                          </Typography>
                          <Paper sx={{ 
                            display: 'inline-block', 
                            p: 1.2, 
                            borderRadius: 2, 
                            bgcolor: m.senderId === user._id ? greenPalette[700] : 'rgba(30, 41, 59, 0.8)',
                            color: '#ffffff',
                            maxWidth: '75%',
                            textAlign: 'left'
                          }}>
                            <Typography variant="body2">{m.message}</Typography>
                          </Paper>
                          {m.isFlagged && (
                            <Typography variant="caption" color="error" display="block">
                              ⚠️ Flagged by AI Toxicity Filter
                            </Typography>
                          )}
                        </Box>
                      ))
                    )}
                  </Box>

                  {/* Send Message Input */}
                  <Stack direction="row" spacing={1.5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Message Drive Space Channel..."
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)', borderRadius: 1.5, input: { color: '#ffffff' } }}
                    />
                    <Button 
                      variant="contained" 
                      onClick={handleSendMessage}
                      endIcon={<Send />}
                      sx={{ bgcolor: greenPalette[500], '&:hover': { bgcolor: greenPalette[600] }, fontWeight: 700 }}
                    >
                      Send
                    </Button>
                  </Stack>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 'auto' }}>
                  Select a Drive Space from the left sidebar to enter the collaboration channel.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* MODE 2: PERSONALIZED AI CAREER BOT (STRICT USER PRIVACY & PERSISTENT CHAT HISTORY) */}
      {chatMode === 1 && (
        <PersonalizedAiChat />
      )}

      {/* HOD Create Space Modal */}
      <Dialog open={openSpaceModal} onClose={() => setOpenSpaceModal(false)}>
        <DialogTitle sx={{ bgcolor: 'var(--bg-dark-paper)', color: '#ffffff' }}>Create New Drive Space (HOD Only)</DialogTitle>
        <DialogContent sx={{ bgcolor: 'var(--bg-dark-paper)', pt: 2 }}>
          <TextField
            fullWidth
            margin="dense"
            label="Space Name (e.g., Zoho Technical Drive Space)"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            sx={{ input: { color: '#ffffff' }, label: { color: 'var(--text-secondary)' } }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Space Description"
            value={spaceDesc}
            onChange={(e) => setSpaceDesc(e.target.value)}
            sx={{ input: { color: '#ffffff' }, label: { color: 'var(--text-secondary)' } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'var(--bg-dark-paper)' }}>
          <Button onClick={() => setOpenSpaceModal(false)} sx={{ color: 'var(--text-secondary)' }}>Cancel</Button>
          <Button onClick={handleCreateSpace} variant="contained" sx={{ bgcolor: greenPalette[500] }}>Create Space</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DriveSpaceChat;
