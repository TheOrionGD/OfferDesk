const mongoose = require('mongoose');

const drivePrepMaterialSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  jobId: { type: String, required: true },
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  technicalTopics: [{ type: String }],
  sampleQuestions: [
    {
      question: { type: String },
      category: { type: String },
      difficulty: { type: String },
      recommendedAnswerKey: { type: String }
    }
  ],
  systemDesignPrep: [{ type: String }],
  aptitudeFocus: [{ type: String }],
  generatedAt: { type: Date, default: Date.now }
});

// COMPOUND unique index on (tenantId, jobId) — replaces old global jobId unique.
// Allows the same jobId reference to have prep materials per tenant independently.
drivePrepMaterialSchema.index({ tenantId: 1, jobId: 1 }, { unique: true });
drivePrepMaterialSchema.index({ tenantId: 1, generatedAt: -1 });

module.exports = mongoose.model('DrivePrepMaterial', drivePrepMaterialSchema);
