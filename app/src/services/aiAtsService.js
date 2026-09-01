import axios from 'axios';

export const scoreAndRankCandidates = async (jobSpec, candidates, weights = {}) => {
  if (!jobSpec || !jobSpec.id) {
    throw new Error('⚠️ Drive Specification Required: Please select an active recruitment drive to rank candidates.');
  }

  if (!candidates || candidates.length === 0) {
    throw new Error('⚠️ Candidate Records Required: No candidate applicants found for ATS ranking.');
  }

  const payload = {
    job_spec: {
      id: jobSpec.id,
      title: jobSpec.title,
      description: jobSpec.description || '',
      required_skills: jobSpec.requiredSkills || jobSpec.skills || [],
      min_gpa: parseFloat(jobSpec.minGpa || jobSpec.gpa || 0),
      certifications: jobSpec.certifications || []
    },
    candidates: candidates.map((c) => ({
      id: c.id || c._id || '',
      name: c.name || '',
      email: c.email || '',
      skills: Array.isArray(c.skills) ? c.skills : (c.skills ? c.skills.split(',').map(s => s.trim()) : []),
      gpa: parseFloat(c.gpa || c.cgpa || 0),
      bio: c.bio || c.experience || '',
      project_summary: c.projectSummary || c.projects || '',
      certifications: c.certifications || []
    })),
    weights: {
      skills_weight: weights.skills_weight ?? 0.40,
      projects_weight: weights.projects_weight ?? 0.30,
      gpa_weight: weights.gpa_weight ?? 0.20,
      certs_weight: weights.certs_weight ?? 0.10
    }
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  try {
    const res = await axios.post(`${API_BASE_URL}/api/ats/rank`, payload);
    if (res.data && res.data.leaderboard) {
      return res.data;
    }
    throw new Error('Malformed AI response from server.');
  } catch (err) {
    const msg = err.response?.data?.error || '⚠️ Service Currently Unavailable: Unable to communicate with Sentence-Transformers Python AI engine on port 8000.';
    throw new Error(msg);
  }
};
