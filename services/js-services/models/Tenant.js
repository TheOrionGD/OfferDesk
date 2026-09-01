const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  domain: { type: String, required: true },
  plan: { type: String, enum: ['BASIC', 'PRO', 'ENTERPRISE'], default: 'PRO' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'PENDING'], default: 'ACTIVE' },
  accreditation: { type: String, default: 'NAAC A++' },
  studentCount: { type: Number, default: 0 },
  placementOfficerName: { type: String },
  contactEmail: { type: String, required: true },
  customBatches: [{ type: String, default: ['Product Super Dream', 'Core Engineering', 'IT Services', 'GATE & Higher Studies'] }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', tenantSchema);
