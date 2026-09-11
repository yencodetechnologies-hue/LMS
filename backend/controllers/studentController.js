const StudentSubmission = require('../models/StudentSubmission');
const Course = require('../models/Course');

exports.submitStudentForm = async (req, res) => {
  try {
    const { student, rtoId, courseId, responses } = req.body;

    if (!student || !rtoId || !courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields (student, rtoId, or courseId)' 
      });
    }

    const hasAnswers = Array.isArray(responses) && responses.length > 0;

    // Check if a submission already exists for this student and course
    let existingSubmission = await StudentSubmission.findOne({
      rtoId: rtoId.trim(),
      courseId: courseId.trim(),
      'student.studentId': student.studentId.trim()
    });

    if (existingSubmission) {
      // Update existing submission if responses are provided
      if (hasAnswers) {
        existingSubmission.responses = responses;
        existingSubmission.submittedAt = Date.now();
        existingSubmission.status = 3; // Submitted — pending review, locked
        await existingSubmission.save();
      }
      return res.status(200).json({
        success: true,
        message: 'Student submission updated successfully',
        submissionId: existingSubmission._id,
        submission: existingSubmission
      });
    }

    // Create a new initial submission record upon verification form completion
    const newSubmission = new StudentSubmission({
      student,
      rtoId,
      courseId,
      responses: responses || [],
      status: hasAnswers ? 3 : 0 // 3 = submitted & locked, 0 = blank initial record
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

exports.getStudentSubmission = async (req, res) => {
  try {
    const { rtoId, courseId, studentId } = req.params;
    
    const submission = await StudentSubmission.findOne({ 
      rtoId: rtoId.trim(), 
      courseId: courseId.trim(),
      ...(studentId ? { 'student.studentId': studentId.trim() } : {})
    })
      .populate('courseId')
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

    // Find all submissions matching the RTO ID (case-insensitive search)
    // .populate('courseId') pulls in the full Course document — including
    // knowledgeAssessment.canvasBlocks — so the frontend can resolve
    // option text for each question response.
    const submissions = await StudentSubmission.find({ 
      rtoId: { $regex: new RegExp(`^${rtoId.trim()}$`, 'i') } 
    })
      .populate('courseId')
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
      .populate('courseId') // Populates full course document including canvasBlocks
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

// @desc    Approve or request reattempt on a student's assessment submission
// @route   PUT /api/students/submissions/:submissionId/verify
// @access  Private (RTO staff)
exports.verifySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body; // 1 = Approved, 2 = Reattempt required

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
    submission.reviewedAt = Date.now();
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