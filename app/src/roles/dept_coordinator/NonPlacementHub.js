import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  Chip, 
  Stack, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider, 
  Link as MuiLink,
  LinearProgress,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  MenuBook, 
  OpenInNew, 
  SmartToy, 
  School, 
  CheckCircle,
  AccountBalance,
  Work,
  RocketLaunch,
  Timeline,
  Star,
  Psychology,
  Help
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { greenPalette } from '../../theme';

export function NonPlacementHub() {
  const { user } = useAuth();
  const { currentTenant, tenantLoading } = useTenant();
  const [domain, setDomain] = useState(user?.nonPlacementDomain || 'HIGHER_STUDIES_GATE');
  const [activeTab, setActiveTab] = useState(0);
  const [pathways, setPathways] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

  const tenantId = currentTenant?.tenantId ?? null;


  const loadDynamicPathways = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/non-placement/pathways?tenantId=${tenantId}`);
      const data = await res.json();
      if (data.success && data.pathways) {
        setPathways(data.pathways);
        const match = data.pathways.find(p => p.domainKey === domain) || data.pathways[0];
        setSelectedPathway(match);
      }
    } catch (err) {
      console.warn("REST API Pathways load error:", err);
    } finally {
      setLoading(false);
    }
  }, [tenantId, domain]);

  const fetchAiRecommendations = useCallback(async (targetPathway) => {
    if (!targetPathway) return;
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const res = await fetch(`${API_URL}/api/ai/non-placement-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: targetPathway.domainKey,
          skills: user?.skills || ['Engineering Mathematics', 'Data Structures', 'System Logic'],
          hod_pathway: targetPathway
        })
      });
      const data = await res.json();
      setAiData(data);
    } catch (err) {
      console.error("Non-Placement AI error:", err);
    }
  }, [user]);

  useEffect(() => {
    loadDynamicPathways();
  }, [loadDynamicPathways]);

  useEffect(() => {
    if (selectedPathway) {
      fetchAiRecommendations(selectedPathway);
    }
  }, [selectedPathway, fetchAiRecommendations]);

  const handleDomainChange = (e) => {
    const chosenKey = e.target.value;
    setDomain(chosenKey);
    const match = pathways.find(p => p.domainKey === chosenKey);
    if (match) setSelectedPathway(match);
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const blueprintTasks = selectedPathway?.actionBlueprint || [];
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = blueprintTasks.length > 0 ? Math.round((completedCount / blueprintTasks.length) * 100) : 0;

  if (tenantLoading) return null;
  if (!tenantId) return (
    <div style={{ padding: '2rem', color: '#ef4444' }}>
      ⚠️ Tenant not loaded. Please refresh or contact your placement officer.
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-emerald-glow)' }}>
        
        {/* Header Banner */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette[300] }}>
              <MenuBook sx={{ fontSize: 36 }} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff', letterSpacing: -0.5 }}>
                  HOD Dynamic Non-Placement & Career Matrix Hub
                </Typography>
                {selectedPathway?.isHodCustomized && (
                  <Chip label="Verified HOD Curated" size="small" color="success" sx={{ fontWeight: 800, borderRadius: 1 }} />
                )}
                <Chip icon={<Star sx={{ color: '#fbbf24 !important' }} />} label="HOD Priority Track" size="small" sx={{ bgcolor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', fontWeight: 800, borderRadius: 1 }} />
                <Chip icon={<RocketLaunch sx={{ color: '#38bdf8 !important' }} />} label="Fast-Track Career Launch" size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800, borderRadius: 1 }} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Custom Department Pathways configured by <span style={{ color: greenPalette[300], fontWeight: 700 }}>{selectedPathway?.creatorName || 'Department HOD'}</span> for {currentTenant?.name || ''}.
              </Typography>
            </Box>
          </Stack>

          {/* Domain Selector Dropdown */}
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Select Career Track</InputLabel>
            <Select
              value={selectedPathway?.domainKey || domain}
              onChange={handleDomainChange}
              sx={{ color: '#ffffff', bgcolor: 'rgba(30, 41, 59, 0.9)', borderRadius: 2, fontWeight: 700 }}
            >
              {pathways.map(p => (
                <MenuItem key={p._id || p.domainKey} value={p.domainKey}>
                  {p.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {loading && <LinearProgress sx={{ mb: 3, bgcolor: greenPalette[900], '& .MuiLinearProgress-bar': { bgcolor: greenPalette.A400 } }} />}

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'var(--border-subtle)', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            textColor="inherit"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { color: 'text.secondary', fontWeight: 700, fontSize: '0.85rem' },
              '& .Mui-selected': { color: greenPalette[300] },
              '& .MuiTabs-indicator': { backgroundColor: greenPalette.A400 }
            }}
          >
            <Tab icon={<School sx={{ fontSize: 18 }} />} iconPosition="start" label="1. Track Overview & Vision" />
            <Tab icon={<AccountBalance sx={{ fontSize: 18 }} />} iconPosition="start" label="2. Criteria & Eligibility" />
            <Tab icon={<Work sx={{ fontSize: 18 }} />} iconPosition="start" label={`3. Sector Roles (${selectedPathway?.roles?.length || 0})`} />
            <Tab icon={<Timeline sx={{ fontSize: 18 }} />} iconPosition="start" label={`4. Semester Blueprint (${progressPercent}%)`} />
            <Tab icon={<OpenInNew sx={{ fontSize: 18 }} />} iconPosition="start" label="5. Official Portals & AI Advice" />
          </Tabs>
        </Box>

        {/* TAB 1: OVERVIEW & VISION */}
        {activeTab === 0 && selectedPathway && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', p: 1 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: greenPalette[300], mb: 1 }}>
                    {selectedPathway.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff', mb: 3 }}>
                    {selectedPathway.description}
                  </Typography>

                  {selectedPathway.visionNote && (
                    <Paper sx={{ p: 2.5, bgcolor: 'rgba(76, 175, 80, 0.08)', border: '1px solid var(--border-emerald-glow)', borderRadius: 3, mb: 3 }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Psychology sx={{ color: greenPalette.A200, mt: 0.3 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: greenPalette[300] }}>
                            HOD Departmental Vision & Psychology Note:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', mt: 0.5 }}>
                            "{selectedPathway.visionNote}"
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Target Pay / Stipend Scale</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff', mt: 0.5 }}>
                          {selectedPathway.criteria?.stipendOrPackageBand || ''}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Department Coordinator</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: greenPalette[300], mt: 0.5 }}>
                          {selectedPathway.creatorName || 'Department HOD'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 2 }}>
                    Key Track Quick Stats
                  </Typography>
                  <Stack spacing={2}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Minimum GPA Required</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: greenPalette.A400 }}>
                        {selectedPathway.criteria?.minGpa || 6.0} / 10.0
                      </Typography>
                    </Paper>

                    <Paper sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Max Backlogs Allowed</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#fbbf24' }}>
                        {selectedPathway.criteria?.maxBacklogs || 0} Backlogs Max
                      </Typography>
                    </Paper>

                    <Paper sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Eligible Branches</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff', mt: 0.5 }}>
                        {selectedPathway.criteria?.eligibleBranches?.join(' • ') || 'All Engineering Branches'}
                      </Typography>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* TAB 2: CRITERIA & ELIGIBILITY */}
        {activeTab === 1 && selectedPathway && (
          <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: greenPalette[300], mb: 2 }}>
                HOD Defined Eligibility Rules & Cutoff Benchmark
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2.5, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>MINIMUM CGPA</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: greenPalette[300], my: 1 }}>
                      {selectedPathway.criteria?.minGpa || 6.0}
                    </Typography>
                    <Chip label="Cutoff Metric" size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: greenPalette[300] }} />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2.5, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>MAX BACKLOGS</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fbbf24', my: 1 }}>
                      {selectedPathway.criteria?.maxBacklogs || 0}
                    </Typography>
                    <Chip label="Academic Backlog Limit" size="small" sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }} />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2.5, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>AGE CEILING</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#38bdf8', my: 1 }}>
                      {selectedPathway.criteria?.ageLimit || 28} Yrs
                    </Typography>
                    <Chip label="Exam Age Ceiling" size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }} />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2.5, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>STIPEND / PAY SCALE</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: greenPalette.A400, my: 1.5 }}>
                      {selectedPathway.criteria?.stipendOrPackageBand || 'Standard'}
                    </Typography>
                    <Chip label="Compensation Band" size="small" color="success" />
                  </Paper>
                </Grid>
              </Grid>

              {selectedPathway.criteria?.cutoffScoreNote && (
                <Paper sx={{ p: 3, bgcolor: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-emerald-glow)', borderRadius: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: greenPalette[300], mb: 1 }}>
                    Detailed Exam Cutoffs & Percentile Benchmarks:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    {selectedPathway.criteria.cutoffScoreNote}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 3: VAST SECTOR ROLES */}
        {activeTab === 2 && selectedPathway && (
          <Stack spacing={2.5}>
            {selectedPathway.roles?.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No sector roles configured for this track yet.</Typography>
            ) : (
              selectedPathway.roles?.map((role, idx) => (
                <Card key={role._id || idx} sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)' }}>
                  <CardContent>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Chip label={role.sector} size="small" color="primary" sx={{ fontWeight: 700 }} />
                          <Chip icon={<Star sx={{ fontSize: '0.85rem !important', color: '#fbbf24 !important' }} />} label="HOD Recommended Role" size="small" sx={{ bgcolor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', fontWeight: 800 }} />
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                          {role.roleTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {role.description}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Chip label={`Expected Pay: ${role.expectedPackage || '₹10+ LPA'}`} color="success" sx={{ fontWeight: 800 }} />
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 2, borderColor: 'var(--border-subtle)' }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Essential Technical Skills</Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                          {role.essentialSkills?.map((s, i) => (
                            <Chip key={i} label={s} size="small" sx={{ bgcolor: 'rgba(30, 41, 59, 0.8)', color: '#ffffff', fontSize: '0.7rem' }} />
                          ))}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Required Certifications & Scorecards</Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                          {role.requiredCertifications?.map((c, i) => (
                            <Chip key={i} label={c} size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: greenPalette[300], fontSize: '0.7rem' }} />
                          ))}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Top Recruiting Bodies & Institutes</Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
                          {role.topEmployers?.map((e, i) => (
                            <Chip key={i} label={e} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.7rem' }} />
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        )}

        {/* TAB 4: SEMESTER BLUEPRINT & READINESS TRACKER */}
        {activeTab === 3 && selectedPathway && (
          <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', p: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: greenPalette[300] }}>
                    Semester Preparation Blueprint (Semesters 5 - 8)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track your semester-wise readiness against milestones set by your HOD.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: greenPalette.A400 }}>
                      {progressPercent}% Complete
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{completedCount} of {blueprintTasks.length} Milestones Checked</Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setCompletedTasks({})}
                    sx={{ borderColor: greenPalette[500], color: greenPalette[300], fontWeight: 700, textTransform: 'none' }}
                  >
                    Reset Checklist
                  </Button>
                </Stack>
              </Stack>

              <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4, mb: 3, bgcolor: 'rgba(30, 41, 59, 0.8)', '& .MuiLinearProgress-bar': { bgcolor: greenPalette.A400 } }} />

              <Stack spacing={2}>
                {blueprintTasks.map((task, idx) => {
                  const taskId = task._id || `task_${idx}`;
                  const isChecked = !!completedTasks[taskId];
                  return (
                    <Paper key={taskId} sx={{ p: 2, bgcolor: isChecked ? 'rgba(76, 175, 80, 0.1)' : 'rgba(30, 41, 59, 0.7)', border: `1px solid ${isChecked ? greenPalette[500] : 'var(--border-subtle)'}`, borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={isChecked} 
                              onChange={() => toggleTask(taskId)}
                              sx={{ color: greenPalette[400], '&.Mui-checked': { color: greenPalette.A400 } }} 
                            />
                          }
                          label={
                            <Box>
                              <Stack direction="row" spacing={1} alignItems="center">
                                {isChecked && <CheckCircle sx={{ color: greenPalette.A400, fontSize: 18 }} />}
                                <Chip label={task.semester} size="small" color="primary" sx={{ fontWeight: 700 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isChecked ? greenPalette[300] : '#ffffff', textDecoration: isChecked ? 'line-through' : 'none' }}>
                                  {task.taskTitle}
                                </Typography>
                              </Stack>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {task.description}
                              </Typography>
                            </Box>
                          }
                        />
                        {task.mandatoryResourceUrl && (
                          <MuiLink href={task.mandatoryResourceUrl} target="_blank" rel="noopener" sx={{ color: greenPalette.A200, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            Resource Link <OpenInNew sx={{ fontSize: 16 }} />
                          </MuiLink>
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* TAB 5: OFFICIAL PORTALS & AI ADVICE */}
        {activeTab === 4 && (
          <Grid container spacing={3}>
            {/* AI Custom Suggestions */}
            <Grid item xs={12} md={7}>
              <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', height: '100%' }}>
                <CardContent>
                  <Paper sx={{ p: 2, mb: 2.5, bgcolor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Help sx={{ color: '#38bdf8' }} />
                      <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                        How HOD Criteria Matching Works
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      The AI engine cross-references candidate CGPA, backlog status, and technical skill tags against HOD cutoffs to generate target study roadmaps.
                    </Typography>
                  </Paper>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <SmartToy sx={{ color: greenPalette.A400 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: greenPalette[300] }}>
                      AI Personal Study Roadmap ({aiData?.title || 'Generative Model'})
                    </Typography>
                  </Stack>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
                    AI Recommendations based on your profile & HOD Criteria:
                  </Typography>

                  <Stack spacing={1.5} sx={{ my: 2 }}>
                    {aiData?.recommendations?.map((rec, idx) => (
                      <Paper key={idx} sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                          • {rec}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Official Portals */}
            <Grid item xs={12} md={5}>
              <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 2 }}>
                    HOD Verified Official Portals
                  </Typography>
                  <Stack spacing={2}>
                    {selectedPathway?.resources?.map((res, idx) => (
                      <Paper key={idx} sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.8)', border: `1px solid ${greenPalette[500]}40`, borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Chip label={res.type || 'Portal'} size="small" color="primary" sx={{ fontWeight: 700, mb: 0.5 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                              {res.title}
                            </Typography>
                          </Box>
                          <MuiLink href={res.url} target="_blank" rel="noopener" sx={{ color: greenPalette.A200 }}>
                            <OpenInNew />
                          </MuiLink>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

      </Paper>
    </Container>
  );
}

export default NonPlacementHub;
