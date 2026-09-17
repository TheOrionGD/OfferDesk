const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  action: { type: String, required: true },
  actorRole: { type: String, required: true },
  actorId: { type: String, required: true },
  details: { type: String, required: true },
  documentUrl: { type: String },
  complianceVerified: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
auditLogSchema.index({ tenantId: 1, timestamp: -1 });
auditLogSchema.index({ tenantId: 1, action: 1 });
auditLogSchema.index({ tenantId: 1, actorId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
