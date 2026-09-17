const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  jobId: { type: String, required: true },
  studentId: { type: String, required: true },
  evaluatorId: { type: String, required: true },
  technicalScore: { type: Number, min: 1, max: 10, required: true },
  communicationScore: { type: Number, min: 1, max: 10, required: true },
  problemSolvingScore: { type: Number, min: 1, max: 10, required: true },
  overallRating: { type: Number, min: 1, max: 10, required: true },
  feedback: { type: String, required: true },
  decision: { type: String, enum: ['RECOMMEND', 'HOLD', 'REJECT'], default: 'RECOMMEND' },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
evaluationSchema.index({ tenantId: 1, jobId: 1 });
evaluationSchema.index({ tenantId: 1, studentId: 1 });
evaluationSchema.index({ tenantId: 1, evaluatorId: 1 });
evaluationSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('Evaluation', evaluationSchema);
