const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  userId: { type: String, required: true },
  userRole: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'ALERT', 'AI_FLAG'], default: 'INFO' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Compound indexes for tenant-scoped queries
notificationSchema.index({ tenantId: 1, userId: 1 });
notificationSchema.index({ tenantId: 1, userRole: 1, isRead: 1 });
notificationSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
