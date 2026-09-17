const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  // spaceId is set for Drive Space group chat messages; null/undefined for direct DMs
  spaceId: { type: String, default: null },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  receiverId: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverRole: { type: String, required: true },
  message: { type: String, required: true },
  isFlagged: { type: Boolean, default: false },
  flaggedWords: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
// Direct message thread lookup
chatMessageSchema.index({ tenantId: 1, senderId: 1, receiverId: 1 });
// Drive Space group chat lookup
chatMessageSchema.index({ tenantId: 1, spaceId: 1, createdAt: 1 });
chatMessageSchema.index({ tenantId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
