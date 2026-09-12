const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/submit', studentController.submitStudentForm);

router.get('/submission/:rtoId/:courseId/:studentId', studentController.getStudentSubmission);
router.get('/submission/:rtoId/:courseId', studentController.getStudentSubmission);

// List ALL submissions, not scoped to a single RTO
router.get('/submissions/all', studentController.getAllSubmissions);

router.get('/submissions/rto/:rtoId', studentController.getSubmissionsByRto);

router.put('/submissions/:submissionId/verify', studentController.verifySubmission);
router.put('/submissions/:submissionId/feedback', studentController.submitTeacherFeedback);

// Assign a teacher to a submission (teacherId: null to unassign)
router.put('/submissions/:submissionId/assign-teacher', studentController.assignTeacherToSubmission);
// Get all submissions for a student across every course under one RTO
router.get('/submissions/student/:rtoId/:studentId', studentController.getSubmissionsByStudent);
// Get submissions assigned specifically to a teacher
router.get('/submissions/teacher/:teacherId', studentController.getSubmissionsByTeacher);
// Get deduped student list for a teacher's "My Students" view
router.get('/:teacherId/students', studentController.getStudentsByTeacher);

module.exports = router;