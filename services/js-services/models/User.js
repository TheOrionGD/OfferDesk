const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      'system_admin', 
      'tenant_admin', 
      'dept_coordinator', 
      'recruiter', 
      'evaluator', 
      'alumni',
      'mentor',
      'student', 
      'auditor'
    ], 
    required: true 
  },
  department: { type: String },
  gpa: { type: Number, default: null },
  backlogs: { type: Number, default: 0 },
  skills: [{ type: String }],
  bio: { type: String, default: '' },
  company: { type: String, default: '' },
  verifiedByDept: { type: Boolean, default: false },
  darkMode: { type: Boolean, default: true },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  academicYear: { type: Number, default: 4 },
  joiningYear: { type: Number, default: 2023 },
  isVerified: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  blockedUntil: { type: Date },
  flaggedReason: { type: String, default: '' },
  assignedMentorId: { type: String, default: '' },
  aiRating: { type: Number, default: null },
  // Placement Stream & Dynamic Batch Pool Assignment (Assigned by HOD & Placement Cell)
  placementIntent: { type: String, enum: ['PLACEMENT', 'NON_PLACEMENT', 'UNCOMMITTED'], default: 'PLACEMENT' },
  customBatchTag: { type: String, default: 'Product Super Dream' },
  nonPlacementDomain: { type: String, enum: ['HIGHER_STUDIES_GATE', 'HIGHER_STUDIES_GRE_CAT', 'OFF_CAMPUS_JOBS', 'GOVT_EXAMS_UPSC', 'ENTREPRENEURSHIP_STARTUP'], default: 'HIGHER_STUDIES_GATE' },
  // Native MongoDB Resume & Document Storage (Replaces external cloud S3)
  resumeData: { type: String, default: '' },
  resumeFileName: { type: String, default: '' },
  resumeMimeType: { type: String, default: 'application/pdf' },
  resumeUploadedAt: { type: Date },
  documents: [{
    docId: { type: String },
    docName: { type: String },
    mimeType: { type: String },
    data: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// COMPOUND unique index on (tenantId, email) — replaces the old global email unique.
// This allows the same email address to exist in different tenant organizations
// (e.g. two colleges both having rajan@cse.ac.in as a local account).
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

// Additional compound indexes for performance on common query patterns
userSchema.index({ tenantId: 1, role: 1 });
userSchema.index({ tenantId: 1, department: 1 });
userSchema.index({ tenantId: 1, placementIntent: 1 });
userSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
