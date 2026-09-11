const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// POST route to handle student submissions
router.post('/submit', studentController.submitStudentForm);

// GET routes to fetch student submission details
router.get('/submission/:rtoId/:courseId/:studentId', studentController.getStudentSubmission);
router.get('/submission/:rtoId/:courseId', studentController.getStudentSubmission);

// FIX: Use getSubmissionsByRto to ensure courseId is populated with question/canvas blocks
router.get('/submissions/rto/:rtoId', studentController.getSubmissionsByRto);
router.put('/submissions/:submissionId/verify', studentController.verifySubmission);

module.exports = router;