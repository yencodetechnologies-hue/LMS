const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadStream } = require('../config/cloudinary');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  saveCourseAssessment,
  getStudentCourseDocuments,
  getAssessmentBySlug,
  getMyPurchasedCourses
} = require('../controllers/Coursecontroller');

const verifyToken = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


// Route to get courses bought by the authenticated user/RTO
router.get('/my-courses', verifyToken, getMyPurchasedCourses);

/* =============================================================
   PUBLIC ROUTES
============================================================== */
router.get('/assessment/slug/:slug', getAssessmentBySlug);

/* =============================================================
   PROTECTED ADMIN & STUDENT ROUTES (Require Bearer token)
============================================================== */
// router.use(verifyToken);

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const result = await uploadStream(req.file.buffer, 'courses');

    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

router.get('/', getCourses);
router.post('/', createCourse);

// Assessment save endpoint updated to accept type parameter (fixes 404 error)
router.put('/:courseId/assessment/:type', saveCourseAssessment);

// Student 6-documents view endpoint
router.get('/:id/student-documents', getStudentCourseDocuments);

router.get('/:id', getCourse);
router.put('/:id', updateCourse);
router.patch('/:id/status', toggleCourseStatus);
router.delete('/:id', deleteCourse);

module.exports = router;