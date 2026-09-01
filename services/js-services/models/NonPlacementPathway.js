const mongoose = require('mongoose');

const SectorRoleSchema = new mongoose.Schema({
  roleTitle: { type: String, required: true },
  sector: { type: String, required: true },
  description: { type: String, default: '' },
  essentialSkills: [{ type: String }],
  requiredCertifications: [{ type: String }],
  topEmployers: [{ type: String }],
  expectedPackage: { type: String, default: '' }
}, { _id: true });

const ActionBlueprintItemSchema = new mongoose.Schema({
  semester: { type: String, required: true }, // e.g. "Semester 5", "Semester 6", "Semester 7", "Semester 8"
  taskTitle: { type: String, required: true },
  description: { type: String, default: '' },
  deadline: { type: String, default: '' },
  mandatoryResourceUrl: { type: String, default: '' }
}, { _id: true });

const PathwayResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Portal' }, // "Portal", "Exam Guide", "Research Grant", "Syllabus PDF"
  url: { type: String, required: true }
}, { _id: true });

const NonPlacementPathwaySchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  department: { type: String, required: true, default: 'General' },
  createdBy: { type: String, required: true },
  creatorName: { type: String, required: true },
  domainKey: { 
    type: String, 
    required: true,
    enum: [
      'HIGHER_STUDIES_GATE', 
      'HIGHER_STUDIES_GRE_CAT', 
      'GOVT_EXAMS_UPSC', 
      'OFF_CAMPUS_JOBS', 
      'ENTREPRENEURSHIP_STARTUP',
      'DEFENCE_DIRECT_ENTRY',
      'CUSTOM'
    ] 
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  visionNote: { type: String, default: '' },
  criteria: {
    minGpa: { type: Number, default: 6.0 },
    maxBacklogs: { type: Number, default: 0 },
    ageLimit: { type: Number, default: 30 },
    eligibleBranches: [{ type: String }],
    cutoffScoreNote: { type: String, default: '' },
    stipendOrPackageBand: { type: String, default: '' }
  },
  roles: [SectorRoleSchema],
  actionBlueprint: [ActionBlueprintItemSchema],
  resources: [PathwayResourceSchema],
  isPublished: { type: Boolean, default: true },
  isHodCustomized: { type: Boolean, default: true }
}, { timestamps: true });

// Compound indexes for tenant-scoped queries
NonPlacementPathwaySchema.index({ tenantId: 1, department: 1 });
NonPlacementPathwaySchema.index({ tenantId: 1, domainKey: 1 });
NonPlacementPathwaySchema.index({ tenantId: 1, isPublished: 1 });

module.exports = mongoose.model('NonPlacementPathway', NonPlacementPathwaySchema);
