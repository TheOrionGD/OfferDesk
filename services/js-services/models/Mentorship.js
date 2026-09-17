const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  alumniId: { type: String, required: true },
  studentId: { type: String, required: true },
  topic: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ['BOOKED', 'COMPLETED', 'CANCELLED'], default: 'BOOKED' },
  meetingUrl: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
mentorshipSchema.index({ tenantId: 1, alumniId: 1 });
mentorshipSchema.index({ tenantId: 1, studentId: 1 });
mentorshipSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('Mentorship', mentorshipSchema);
