const mongoose = require('mongoose');

const studentConsentSchema = new mongoose.Schema({
  consentId: { type: String, required: true },
  tenantId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, default: '' },
  
  // Subject category matching Indian College standards
  subject: {
    type: String,
    enum: [
      'PLACEMENT_POLICY_UNDERTAKING',
      'UGC_ANTI_RAGGING_UNDERTAKING',
      'ATTENDANCE_CONDONATION_UNDERTAKING',
      'GAP_YEAR_AFFIDAVIT_DECLARATION',
      'FEE_PAYMENT_INSTALLMENT_UNDERTAKING',
      'SCHOLARSHIP_DUPLICATE_INCOME_DECLARATION',
      'OUTSTATION_TRIP_INDEMNITY_WAIVER',
      'PROJECT_PLAGIARISM_DECLARATION',
      'MEDICAL_FITNESS_EMERGENCY_CONSENT',
      'CUSTOM_NOTICE_UNDERTAKING'
    ],
    default: 'PLACEMENT_POLICY_UNDERTAKING'
  },
  
  title: { type: String, required: true },
  details: { type: String, required: true },
  issuedBy: { type: String, default: 'Training & Placement Office' },
  issuedByRole: { type: String, default: 'tenant_admin' },
  issuerAuthority: { 
    type: String, 
    enum: ['CAMPUS_PLACEMENT_OFFICER', 'DEPARTMENT_HOD'], 
    default: 'CAMPUS_PLACEMENT_OFFICER' 
  },
  trainingAmount: { type: String, default: '' }, // For Campus Placement Officer Training Fees & Drive Costs
  departmentName: { type: String, default: '' }, // For Department HOD Academic & Attendance Notices
  
  status: {
    type: String,
    enum: ['PENDING', 'CONSENT_GRANTED', 'EXPIRED_OVERDUE', 'REVOKED'],
    default: 'PENDING'
  },
  
  expirationHours: { type: Number, default: 48 },
  expiresAt: { type: Date, required: true },
  
  // Cryptographic E-Signature Data
  digitalSignature: { type: String, default: '' },
  signatureHash: { type: String, default: '' },
  grantedAt: { type: Date },
  
  // Dual Signature / Parent Consent Details
  parentConsentRequired: { type: Boolean, default: false },
  parentName: { type: String, default: '' },
  parentSignature: { type: String, default: '' },
  
  allowManualPrintout: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now }
});

// Indexes for fast tenant-scoped & student-scoped queries
studentConsentSchema.index({ tenantId: 1, consentId: 1 }, { unique: true });
studentConsentSchema.index({ tenantId: 1, studentId: 1, status: 1 });
studentConsentSchema.index({ tenantId: 1, expiresAt: 1 });

module.exports = mongoose.model('StudentConsent', studentConsentSchema);
