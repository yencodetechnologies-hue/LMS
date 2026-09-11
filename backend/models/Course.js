const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    fee: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    mappingDocumentUrl: { type: String, default: '' },
    knowledgeAssessment: {
      slug: { type: String, trim: true, lowercase: true, sparse: true, index: true },
      html: { type: String, default: '' },
      canvasBlocks: { type: Array, default: [] },
      updatedAt: { type: Date, default: Date.now },
    },
    knowledgeAnswerGuideUrl: { type: String, default: '' },
    practicalAssessment: {
      slug: { type: String, trim: true, lowercase: true, sparse: true, index: true },
      html: { type: String, default: '' },
      canvasBlocks: { type: Array, default: [] },
      updatedAt: { type: Date, default: Date.now },
    },
    practicalMarkingGuideUrl: { type: String, default: '' },
    jobPackTemplateUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);