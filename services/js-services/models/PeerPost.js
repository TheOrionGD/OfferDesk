const mongoose = require('mongoose');

const peerPostSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

// Compound index for tenant-scoped queries
peerPostSchema.index({ tenantId: 1, timestamp: -1 });

module.exports = mongoose.model('PeerPost', peerPostSchema);
