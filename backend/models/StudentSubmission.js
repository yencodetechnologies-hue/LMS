// Backend: models/StudentSubmission.js
const mongoose = require('mongoose');

const studentSubmissionSchema = new mongoose.Schema(
  {
    student: {
      studentName: { type: String, required: true, trim: true },
      studentId: { type: String, required: true, trim: true },
      studentEmail: { type: String, required: true, trim: true },
      date: { type: String, required: true }
    },
    rtoId: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    responses: [
      {
        questionIndex: Number,
        questionText: String,
        studentSelection: mongoose.Schema.Types.Mixed,
        correctAnswer: mongoose.Schema.Types.Mixed,
        verdict: { type: String, default: 'Pending Review' }
      }
    ],
    submittedAt: { type: Date, default: Date.now },
    status: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 0 = pending, 1 = approved, 2 = reattempt
reviewedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentSubmission', studentSubmissionSchema);