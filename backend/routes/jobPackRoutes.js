const express = require('express');
const router = express.Router();
const { getJobPackData } = require('../controllers/jobPackController');

// Route to fetch dynamic data for the job pack based on rtoNumber and courseId
router.get('/:rtoNumber/:courseId', getJobPackData);

module.exports = router;