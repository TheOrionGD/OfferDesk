const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'URGENT' },
  postedBy: { type: String, required: true },
  postedByRole: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24-Hour Auto-Expiration
  }
});

// Compound indexes for tenant-scoped queries
noticeSchema.index({ tenantId: 1, expiresAt: 1 });
noticeSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
