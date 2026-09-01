const mongoose = require('mongoose');

const driveSpaceSchema = new mongoose.Schema({
  spaceId: { type: String, required: true },
  tenantId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, default: 'DRIVE_SPECIFIC' },
  jobId: { type: String },
  hodId: { type: String, required: true },
  hodName: { type: String, required: true },
  coAdminIds: [{ type: String }],
  memberStudentIds: [{ type: String }],
  sharedMaterials: [{
    fileId: String,
    fileName: String,
    fileData: String, // Base64
    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// COMPOUND unique index on (tenantId, spaceId) — replaces old global spaceId unique.
// Ensures spaceId uniqueness within a tenant only.
driveSpaceSchema.index({ tenantId: 1, spaceId: 1 }, { unique: true });
driveSpaceSchema.index({ tenantId: 1, hodId: 1 });
driveSpaceSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('DriveSpace', driveSpaceSchema);
