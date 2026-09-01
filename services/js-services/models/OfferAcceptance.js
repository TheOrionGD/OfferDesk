const mongoose = require('mongoose');

const offerAcceptanceSchema = new mongoose.Schema({
  acceptanceId: { type: String, required: true },
  tenantId: { type: String, required: true },
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  mentorId: { type: String },
  hodId: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'OVERDUE_UNACCEPTED', 'DECLINED'], 
    default: 'PENDING' 
  },
  digitalSignature: { type: String, default: '' },
  signatureHash: { type: String, default: '' },
  salary: { type: String, default: '' }, // populated at sign time from DriveJob.salary for accepted-offer analytics
  acceptedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) // 48-Hour Deadline
  }
});

// COMPOUND unique index on (tenantId, acceptanceId) — replaces old global acceptanceId unique.
// Ensures acceptanceId uniqueness within a tenant only.
offerAcceptanceSchema.index({ tenantId: 1, acceptanceId: 1 }, { unique: true });
offerAcceptanceSchema.index({ tenantId: 1, studentId: 1 });
offerAcceptanceSchema.index({ tenantId: 1, status: 1, expiresAt: 1 });
offerAcceptanceSchema.index({ tenantId: 1, jobId: 1 });

module.exports = mongoose.model('OfferAcceptance', offerAcceptanceSchema);
