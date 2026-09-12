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
    teacherFeedback: [
      {
        assessorIndex: Number,
        label: {
          type: String,
          enum: ['Assessor result', 'Feedback', 'Overall outcome']
        },
        value: mongoose.Schema.Types.Mixed
      }
    ],
    // The teacher assigned to review this specific submission. Kept as a
    // ref + denormalized name/email (rather than relying on `reviewedBy`,
    // which only fills in once feedback is actually saved) so the RTO
    // admin can assign before any review has happened, and so the
    // student-management table can show "Assigned to" without an extra
    // populate on every row.
    assignedTeacher: {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
      teacherName: { type: String, trim: true, default: '' },
      teacherEmail: { type: String, trim: true, default: '' },
      assignedAt: { type: Date }
    },
    // Signatures are stored as Cloudinary secure_url strings — uploaded
    // server-side from the base64 PNG the canvas sends up (see
    // uploadSignatureIfPresent in studentController.js) — never as raw
    // base64 in the document itself.
    studentSignature: { type: String, trim: true, default: '' },
    studentSignedDate: { type: Date },
    // Bound the exact same way as studentSignature — same field shape
    // (Cloudinary URL string + a separate signed-date timestamp), just
    // populated from submitTeacherFeedback instead of submitStudentForm.
    assessorSignature: { type: String, trim: true, default: '' },
    assessorSignedDate: { type: Date },
    attemptNumber: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    status: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    reviewedAt: { type: Date },
    reviewedBy: {
      teacherId: { type: String, trim: true },
      teacherName: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentSubmission', studentSubmissionSchema);