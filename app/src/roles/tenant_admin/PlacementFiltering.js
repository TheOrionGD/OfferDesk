import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, Box, Button, Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack, Card, CardContent, Slider } from '@mui/material';
import { FilterList, FileDownload, CheckCircle } from '@mui/icons-material';
import { useTenant } from '../../context/TenantContext';
import { greenPalette } from '../../theme';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function PlacementFiltering() {
  const { currentTenant } = useTenant();
  const [minGpa, setMinGpa] = useState(7.0);
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [department, setDepartment] = useState('ALL');
  const [customBatchTag, setCustomBatchTag] = useState('ALL');
  const [placementIntent, setPlacementIntent] = useState('PLACEMENT');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFilteredStudents = async () => {
    setLoading(true);
    try {
      let query = `${API_BASE_URL}/api/filtering/students?tenantId=${currentTenant.tenantId}&minGpa=${minGpa}&maxBacklogs=${maxBacklogs}&placementIntent=${placementIntent}`;
      if (department !== 'ALL') query += `&department=${department}`;
      if (customBatchTag !== 'ALL') query += `&customBatchTag=${encodeURIComponent(customBatchTag)}`;

      const res = await fetch(query);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Filtering API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredStudents();
  }, [minGpa, maxBacklogs, department, customBatchTag, placementIntent, currentTenant]);

  const handleExportCsv = () => {
    if (students.length === 0) return;
    const headers = ["Name", "Email", "Department", "GPA", "Backlogs", "Batch Pool", "Intent"];
    const rows = students.map(s => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.department || ''}"`,
      s.gpa,
      s.backlogs,
      `"${s.customBatchTag || ''}"`,
      `"${s.placementIntent || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eligible_candidates_${currentTenant.code}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, bgcolor: 'var(--bg-dark-card)', border: '1px solid var(--border-emerald-glow)' }}>
        
        {/* Header Title */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Chip label="Placement Cell Console" sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette[300], fontWeight: 700 }} />
              <Chip label={`${currentTenant.name} (${currentTenant.code})`} variant="outlined" sx={{ color: '#ffffff', borderColor: greenPalette[500] }} />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>
              Multi-Criteria Candidate Filtering & Export
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filter eligible candidates using dynamic CGPA thresholds, backlog limits, department, and custom institutional batch tags.
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            startIcon={<FileDownload />} 
            onClick={handleExportCsv}
            disabled={students.length === 0}
            sx={{ bgcolor: greenPalette[500], '&:hover': { bgcolor: greenPalette[600] }, fontWeight: 700, px: 3, py: 1.2 }}
          >
            Export Filtered CSV ({students.length})
          </Button>
        </Stack>

        {/* Filter Controls Grid */}
        <Card sx={{ bgcolor: 'var(--bg-dark-paper)', border: '1px solid var(--border-subtle)', mb: 4 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: greenPalette[300], mb: 2 }}>
              <FilterList sx={{ fontSize: '1.1rem', mr: 1, verticalAlign: 'middle' }} /> Drive Eligibility Parameters
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Minimum CGPA Cutoff: <strong style={{ color: greenPalette.A200 }}>{minGpa}</strong>
                </Typography>
                <Slider 
                  value={minGpa} 
                  min={5.0} 
                  max={9.5} 
                  step={0.1} 
                  onChange={(e, val) => setMinGpa(val)} 
                  valueLabelDisplay="auto"
                  sx={{ color: greenPalette[500] }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Max Standing Backlogs Allowed: <strong style={{ color: greenPalette.A200 }}>{maxBacklogs}</strong>
                </Typography>
                <Slider 
                  value={maxBacklogs} 
                  min={0} 
                  max={5} 
                  step={1} 
                  onChange={(e, val) => setMaxBacklogs(val)} 
                  valueLabelDisplay="auto"
                  sx={{ color: greenPalette[500] }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'var(--text-secondary)' }}>Department</InputLabel>
                  <Select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)}
                    sx={{ color: '#ffffff', bgcolor: 'rgba(30, 41, 59, 0.7)' }}
                  >
                    <MenuItem value="ALL">All Departments</MenuItem>
                    <MenuItem value="CSE">CSE</MenuItem>
                    <MenuItem value="ECE">ECE</MenuItem>
                    <MenuItem value="EEE">EEE</MenuItem>
                    <MenuItem value="MECH">MECH</MenuItem>
                    <MenuItem value="CIVIL">CIVIL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'var(--text-secondary)' }}>Custom Batch Pool</InputLabel>
                  <Select 
                    value={customBatchTag} 
                    onChange={(e) => setCustomBatchTag(e.target.value)}
                    sx={{ color: '#ffffff', bgcolor: 'rgba(30, 41, 59, 0.7)' }}
                  >
                    <MenuItem value="ALL">All Batches</MenuItem>
                    <MenuItem value="Product Super Dream">Product Super Dream</MenuItem>
                    <MenuItem value="Core Engineering">Core Engineering</MenuItem>
                    <MenuItem value="IT Services">IT Services</MenuItem>
                    <MenuItem value="GATE & Higher Studies">GATE & Higher Studies</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Candidate Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(30, 41, 59, 0.9)' }}>
              <TableRow>
                <TableCell sx={{ color: greenPalette[300], fontWeight: 700 }}>Student Candidate</TableCell>
                <TableCell sx={{ color: greenPalette[300], fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ color: greenPalette[300], fontWeight: 700 }}>CGPA</TableCell>
                <TableCell sx={{ color: greenPalette[300], fontWeight: 700 }}>Backlogs</TableCell>
                <TableCell sx={{ color: greenPalette[300], fontWeight: 700 }}>Batch Pool</TableCell>
                <TableCell sx={{ color: greenPalette[300], fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ color: 'var(--text-secondary)' }}>Loading candidates...</TableCell></TableRow>
              ) : students.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ color: 'var(--text-secondary)' }}>No candidates match the specified criteria.</TableCell></TableRow>
              ) : (
                students.map((st) => (
                  <TableRow key={st._id} sx={{ '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.05)' } }}>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>
                      {st.name}
                      <Typography variant="caption" display="block" color="text.secondary">{st.email}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-primary)' }}>{st.department || ''}</TableCell>
                    <TableCell sx={{ color: greenPalette.A200, fontWeight: 700 }}>{st.gpa}</TableCell>
                    <TableCell sx={{ color: st.backlogs === 0 ? greenPalette[300] : '#f43f5e' }}>{st.backlogs}</TableCell>
                    <TableCell>
                      <Chip label={st.customBatchTag || ''} size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.15)', color: greenPalette[300], fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Chip icon={<CheckCircle sx={{ fontSize: '0.85rem !important', color: `${greenPalette.A400} !important` }} />} label="Drive Eligible" size="small" variant="outlined" sx={{ borderColor: greenPalette[500], color: greenPalette[300] }} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>

      </Paper>
    </Container>
  );
}

export default PlacementFiltering;
