const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  jobId: { type: String, required: true },
  studentId: { type: String, required: true },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected'],
    default: 'applied'
  },
  atsScore: { type: Number, default: 0 },
  scoreBreakdown: {
    skills: { type: Number, default: 0 },
    project: { type: Number, default: 0 },
    gpa: { type: Number, default: 0 },
    certs: { type: Number, default: 0 }
  },
  rejectionReason: { type: String },
  aiRecommendedSkillGap: [{ type: String }],
  // Native MongoDB Resume Attachment (Direct DB Storage)
  resumeData: { type: String, default: '' },
  resumeFileName: { type: String, default: '' },
  resumeMimeType: { type: String, default: 'application/pdf' },
  appliedAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
applicationSchema.index({ tenantId: 1, jobId: 1 });
applicationSchema.index({ tenantId: 1, studentId: 1 });
applicationSchema.index({ tenantId: 1, status: 1 });
applicationSchema.index({ tenantId: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
