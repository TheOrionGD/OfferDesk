const mongoose = require('mongoose');

const stressEntrySchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  studentId: { type: String, required: true },
  moodScore: { type: Number, min: 1, max: 10, required: true },
  stressLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], required: true },
  notes: { type: String },
  recommendedAction: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
stressEntrySchema.index({ tenantId: 1, studentId: 1 });
stressEntrySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('StressEntry', stressEntrySchema);
