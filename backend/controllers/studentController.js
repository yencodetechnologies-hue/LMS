const mongoose = require('mongoose');
const StudentSubmission = require('../models/StudentSubmission');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const { uploadStream } = require('../config/cloudinary');

// Converts a base64 data-URL signature (from the canvas) to a Buffer and
// uploads it via the shared uploadStream helper. Returns the hosted
// Cloudinary URL, or '' if no signature was provided.
async function uploadSignatureIfPresent(base64DataUrl, folder) {
  if (!base64DataUrl || !base64DataUrl.startsWith('data:image')) return '';

  const base64Payload = base64DataUrl.split(',')[1]; // strip "data:image/png;base64," prefix
  if (!base64Payload) return '';

  const fileBuffer = Buffer.from(base64Payload, 'base64');
  const result = await uploadStream(fileBuffer, folder);

  return result.secure_url;
}

exports.submitStudentForm = async (req, res) => {
  try {
    const { student, rtoId, courseId, responses, status, studentSignature } = req.body;

    if (!student || !rtoId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (student, rtoId, or courseId)'
      });
    }

    const hasAnswers = Array.isArray(responses) && responses.length > 0;
    const now = new Date(); // server-side dynamic "today" — never trust client-sent dates

    let existingSubmission = await StudentSubmission.findOne({
      rtoId: rtoId.trim(),
      courseId: courseId.trim(),
      'student.studentId': student.studentId.trim()
    });

    // Upload signature (if provided) before touching the document, so a
    // failed upload doesn't leave the submission partially saved.
    let uploadedSignatureUrl = '';
    if (studentSignature) {
      uploadedSignatureUrl = await uploadSignatureIfPresent(
        studentSignature,
        `students/${student.studentId.trim()}`
      );
    }

    if (existingSubmission) {
      if (hasAnswers) {
        const isReattemptResubmission = existingSubmission.status === 2;

        existingSubmission.responses = responses;
        existingSubmission.submittedAt = now;
        existingSubmission.status = status !== undefined && status !== null ? Number(status) : 3;
        existingSubmission.attemptNumber = (existingSubmission.attemptNumber || 0) + 1;

        if (uploadedSignatureUrl) {
          existingSubmission.studentSignature = uploadedSignatureUrl;
          existingSubmission.studentSignedDate = now;
        }

        if (isReattemptResubmission) {
          existingSubmission.teacherFeedback = [];
          existingSubmission.reviewedAt = undefined;
          existingSubmission.reviewedBy = undefined;
          existingSubmission.assessorSignature = '';
          existingSubmission.assessorSignedDate = undefined;
        }

        await existingSubmission.save();
      } else if (status !== undefined && status !== null) {
        existingSubmission.status = Number(status);
        await existingSubmission.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Student submission updated successfully',
        submissionId: existingSubmission._id,
        submission: existingSubmission
      });
    }

    const newSubmission = new StudentSubmission({
      student,
      rtoId,
      courseId,
      responses: responses || [],
      status: status !== undefined && status !== null ? Number(status) : (hasAnswers ? 3 : 0),
      attemptNumber: hasAnswers ? 1 : 0,
      studentSignature: uploadedSignatureUrl,
      studentSignedDate: uploadedSignatureUrl ? now : undefined,
      submittedAt: now,
    });

    await newSubmission.save();

    return res.status(201).json({
      success: true,
      message: 'Student submission stored successfully',
      submissionId: newSubmission._id,
      submission: newSubmission
    });
  } catch (error) {
    console.error('Error saving student response submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving student response'
    });
  }
};

// @desc    Get every submission for one student within an RTO, across all
//          their courses — used to bind status + teacherFeedback onto a
//          student's dashboard/course list, where only rtoNumber + studentId
//          are known (not a specific courseId).
// @route   GET /api/students/submissions/student/:rtoId/:studentId
// @access  Private (Student)
exports.getSubmissionsByStudent = async (req, res) => {
  try {
    const { rtoId, studentId } = req.params;

    if (!rtoId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'rtoId and studentId are required'
      });
    }

    const submissions = await StudentSubmission.find({
      rtoId: rtoId.trim(),
      'student.studentId': studentId.trim()
    })
      .populate('courseId')
      .populate('assignedTeacher.teacherId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions by student:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching student submissions'
    });
  }
};

exports.getStudentSubmission = async (req, res) => {
  try {
    const { rtoId, courseId, studentId } = req.params;
    
    const submission = await StudentSubmission.findOne({ 
      rtoId: rtoId.trim(), 
      courseId: courseId.trim(),
      ...(studentId ? { 'student.studentId': studentId.trim() } : {})
    })
      .populate('courseId')
      .populate('assignedTeacher.teacherId')
      .sort({ createdAt: -1 });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'No submission found for this student/course.' });
    }

    return res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error('Error fetching student submission:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching submission' });
  }
};

exports.getSubmissionsByRtoId = async (req, res) => {
  try {
    const { rtoId } = req.params;

    if (!rtoId) {
      return res.status(400).json({ success: false, message: 'RTO ID is required' });
    }

    const submissions = await StudentSubmission.find({ 
      rtoId: { $regex: new RegExp(`^${rtoId.trim()}$`, 'i') } 
    })
      .populate('courseId')
      .populate('assignedTeacher.teacherId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions by RTO ID:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching student submissions' 
    });
  }
};

exports.getSubmissionsByRto = async (req, res) => {
  try {
    const { rtoId } = req.params;
    const submissions = await StudentSubmission.find({ rtoId: rtoId.trim() })
      .populate('courseId')
      .populate('assignedTeacher.teacherId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions by RTO:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching RTO student submissions' });
  }
};

// @desc    List every student submission across every RTO. Used by the
//          "list all students" view — unlike getSubmissionsByRto /
//          getSubmissionsByRtoId, this is deliberately NOT scoped by
//          rtoId, so it's meant for a super-admin-style view, not a
//          per-RTO teacher/admin view.
// @route   GET /api/students/submissions/all
// @access  Private (platform admin)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await StudentSubmission.find({})
      .populate('courseId')
      .populate('assignedTeacher.teacherId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching all student submissions' });
  }
};

// @desc    Approve or request reattempt on a student's assessment submission
// @route   PUT /api/students/submissions/:submissionId/verify
// @access  Private (RTO staff)
exports.verifySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    if (![1, 2].includes(Number(status))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be 1 (Approved) or 2 (Reattempt required)'
      });
    }

    const submission = await StudentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.status = Number(status);
    submission.reviewedAt = new Date();
    await submission.save();

    return res.status(200).json({
      success: true,
      message: status === 1 ? 'Submission approved' : 'Reattempt requested',
      submission
    });
  } catch (error) {
    console.error('Error verifying submission:', error);
    return res.status(500).json({ success: false, message: 'Server error while verifying submission' });
  }
};

// @desc    Save/update a teacher's Assessor result / Feedback / Overall
//          outcome entries against a student's submission, plus the
//          assessor's signature (uploaded to Cloudinary).
// @route   PUT /api/students/submissions/:submissionId/feedback
// @access  Private (RTO staff / teacher)
exports.submitTeacherFeedback = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { teacherFeedback, status, reviewedBy, assessorSignature } = req.body;

    if (!Array.isArray(teacherFeedback)) {
      return res.status(400).json({
        success: false,
        message: 'teacherFeedback must be an array'
      });
    }

    if (status !== undefined && status !== null && ![1, 2].includes(Number(status))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be 1 (Approved) or 2 (Reattempt required)'
      });
    }

    const submission = await StudentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const now = new Date();

    const validLabels = ['Assessor result', 'Feedback', 'Overall outcome'];
    const cleanedFeedback = teacherFeedback
      .filter((entry) => entry && validLabels.includes(entry.label))
      .map((entry) => ({
        assessorIndex: Number(entry.assessorIndex),
        label: entry.label,
        value: entry.value
      }));

    submission.teacherFeedback = cleanedFeedback;
    submission.reviewedAt = now;

    if (reviewedBy && (reviewedBy.teacherId || reviewedBy.teacherName)) {
      submission.reviewedBy = {
        teacherId: reviewedBy.teacherId || '',
        teacherName: reviewedBy.teacherName || ''
      };
    }

    if (assessorSignature) {
      const folderKey = reviewedBy?.teacherId || submission._id.toString();
      const uploadedUrl = await uploadSignatureIfPresent(
        assessorSignature,
        `assessors/${folderKey}`
      );
      if (uploadedUrl) {
        submission.assessorSignature = uploadedUrl;
        submission.assessorSignedDate = now;
      }
    }

    if (status !== undefined && status !== null) {
      submission.status = Number(status);
    }

    await submission.save();

    return res.status(200).json({
      success: true,
      message: 'Feedback saved successfully',
      submission
    });
  } catch (error) {
    console.error('Error saving teacher feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving teacher feedback'
    });
  }
};

// @desc    Assign (or reassign / unassign) a teacher to a student's
//          submission. Pass teacherId: null to unassign.
// @route   PUT /api/students/submissions/:submissionId/assign-teacher
// @access  Private (RTO admin)
exports.assignTeacherToSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { teacherId } = req.body;

    const submission = await StudentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (!teacherId) {
      submission.assignedTeacher = { teacherId: null, teacherName: '', teacherEmail: '', assignedAt: null };
      await submission.save();
      return res.status(200).json({
        success: true,
        message: 'Teacher unassigned',
        submission
      });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    submission.assignedTeacher = {
      teacherId: teacher._id,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      assignedAt: new Date()
    };

    await submission.save();

    return res.status(200).json({
      success: true,
      message: `Assigned to ${teacher.name}`,
      submission
    });
  } catch (error) {
    console.error('Error assigning teacher to submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while assigning teacher'
    });
  }
};

// @desc    Get student submissions assigned to a specific teacher
//          (one row per submission — used for a detailed/feedback view)
// @route   GET /api/students/submissions/teacher/:teacherId
// @access  Private (Teacher)
exports.getSubmissionsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ success: false, message: 'Teacher ID is required' });
    }

    const submissions = await StudentSubmission.find({ 
      'assignedTeacher.teacherId': teacherId.trim() 
    })
      .populate('courseId')
      .populate('assignedTeacher.teacherId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions by teacher ID:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching teacher student submissions' 
    });
  }
};

// @desc    Get a deduped list of students (one row per student) assigned
//          to a specific teacher, with submission counts and latest status.
//          Unlike getSubmissionsByTeacher (one row per submission), this
//          is for a "My Students" table view.
// @route   GET /api/students/teacher/:teacherId/students
// @access  Private (Teacher)
exports.getStudentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ success: false, message: 'Valid teacher ID is required' });
    }

    const students = await StudentSubmission.aggregate([
      {
        $match: {
          'assignedTeacher.teacherId': new mongoose.Types.ObjectId(teacherId)
        }
      },
      { $sort: { submittedAt: -1 } },
      {
        $group: {
          _id: '$student.studentId',
          studentName: { $first: '$student.studentName' },
          studentEmail: { $first: '$student.studentEmail' },
          lastSubmissionDate: { $first: '$student.date' },
          totalSubmissions: { $sum: 1 },
          lastStatus: { $first: '$status' },
          // rtoId/courseId taken from the most recent submission (sorted
          // above), since that's the one the "Review" button should open
          lastRtoId: { $first: '$rtoId' },
          lastCourseId: { $first: '$courseId' },
          courseIds: { $addToSet: '$courseId' }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseIds',
          foreignField: '_id',
          as: 'courses'
        }
      },
      {
        $project: {
          _id: 0,
          studentId: '$_id',
          studentName: 1,
          studentEmail: 1,
          lastSubmissionDate: 1,
          totalSubmissions: 1,
          lastStatus: 1,
          rtoId: '$lastRtoId',
          courseId: '$lastCourseId',
          courseNames: '$courses.name'
        }
      },
      { $sort: { studentName: 1 } }
    ]);

    return res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    console.error('Error fetching students by teacher:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching teacher students' });
  }
};