const mongoose = require('mongoose');

const driveJobSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  recruiterId: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, default: 'Full-time' },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  minGpa: { type: Number, default: 6.0 },
  maxBacklogs: { type: Number, default: 0 },
  eligibleBranches: [{ type: String }],
  approvedByTenantAdmin: { type: Boolean, default: true },
  status: { type: String, enum: ['ACTIVE', 'CLOSED', 'PENDING'], default: 'ACTIVE' },
  weights: {
    skills: { type: Number, default: 0.4 },
    projects: { type: Number, default: 0.3 },
    gpa: { type: Number, default: 0.2 },
    certs: { type: Number, default: 0.1 }
  },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
driveJobSchema.index({ tenantId: 1, status: 1 });
driveJobSchema.index({ tenantId: 1, recruiterId: 1 });
driveJobSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('DriveJob', driveJobSchema);
