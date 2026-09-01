const mongoose = require('mongoose');

const QuestionBankSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  createdBy: {
    type: String,
    required: true
  },
  creatorName: {
    type: String,
    default: 'Evaluator'
  },
  category: {
    type: String,
    required: true,
    enum: ['DSA', 'System Design', 'DBMS', 'OS & Networking', 'General Technical'],
    default: 'DSA'
  },
  q: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  rubric: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuestionBank', QuestionBankSchema);
