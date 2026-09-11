const Course = require('../models/Course');
const Order = require('../models/Order')
const mongoose = require('mongoose');

// Helper to generate a clean, URL-safe unique slug
const generateSlug = (text = 'assessment') => {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const uniqueCode = Math.random().toString(36).substring(2, 7);
  return `${base || 'assessment'}-${uniqueCode}`;
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error('Get Courses Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching courses' });
  }
};

// @desc    Get a single course
// @route   GET /api/courses/:id
// @access  Private

exports.getMyPurchasedCourses = async (req, res) => {
  try {
    // 1. Find the latest order/checkout record for the logged-in user using their email or ID
    const order = await Order.findOne({ email: req.user.email.toLowerCase() }).sort({ createdAt: -1 });

    if (!order || !order.courses || order.courses.length === 0) {
      return res.status(200).json({ success: true, courses: [] });
    }

    // 2. Fetch full course details matching the course IDs stored in the order
    const purchasedCourses = await Course.find({ _id: { $in: order.courses } });

    return res.status(200).json({
      success: true,
      courses: purchasedCourses
    });
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching purchased courses' });
  }
};
exports.getCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    return res.status(200).json({ success: true, course });
  } catch (error) {
    console.error('Get Course Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching course' });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private
exports.createCourse = async (req, res) => {
  try {
    const { title, category, duration, fee, description, image } = req.body;

    if (!title || !category || !duration || fee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, duration, and fee are required',
      });
    }

    const course = await Course.create({
      title,
      category,
      duration,
      fee,
      description,
      image: image || '',
    });

    return res.status(201).json({ success: true, message: 'Course created successfully', course });
  } catch (error) {
    console.error('Create Course Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error creating course' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    const { title, category, duration, fee, description, image } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (title !== undefined) course.title = title;
    if (category !== undefined) course.category = category;
    if (duration !== undefined) course.duration = duration;
    if (fee !== undefined) course.fee = fee;
    if (description !== undefined) course.description = description;
    if (image !== undefined) course.image = image;

    await course.save();

    return res.status(200).json({ success: true, message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update Course Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error updating course' });
  }
};

// @desc    Toggle active/inactive status
// @route   PATCH /api/courses/:id/status
// @access  Private
exports.toggleCourseStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.status = course.status === 'active' ? 'inactive' : 'active';
    await course.save();

    return res.status(200).json({ success: true, message: 'Status updated', course });
  } catch (error) {
    console.error('Toggle Status Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error updating status' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.deleteOne();

    return res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete Course Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error deleting course' });
  }
};

// @desc    Get all 6 assessment and document links for a purchased course
// @route   GET /api/courses/:id/student-documents
// @access  Private
exports.getStudentCourseDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const documentLinks = {
      courseTitle: course.title,
      documents: [
        {
          id: 1,
          name: 'Mapping Document',
          code: 'AT-ICTBWN307-00',
          type: 'static_pdf',
          url: course.mappingDocumentUrl || null,
        },
        {
          id: 2,
          name: 'Knowledge Assessment',
          code: 'AT-ICTBWN307-01',
          type: 'dynamic_builder',
          url: `/assessment/${course.knowledgeAssessment?.slug || ''}`,
        },
        {
          id: 3,
          name: 'Knowledge Answer Guide',
          code: 'AT-ICTBWN307-01-AG',
          type: 'static_pdf',
          url: course.knowledgeAnswerGuideUrl || null,
        },
        {
          id: 4,
          name: 'Practical Assessment',
          code: 'AT-ICTBWN307-02',
          type: 'dynamic_builder',
          url: `/assessment/${course.practicalAssessment?.slug || ''}`,
        },
        {
          id: 5,
          name: 'Practical Marking Guide',
          code: 'AT-ICTBWN307-02-AG',
          type: 'static_pdf',
          url: course.practicalMarkingGuideUrl || null,
        },
        {
          id: 6,
          name: 'Job Pack Template',
          code: 'JP-ICTBWN307-01',
          type: 'static_pdf',
          url: course.jobPackTemplateUrl || null,
        },
      ],
    };

    return res.status(200).json({ success: true, data: documentLinks });
  } catch (err) {
    console.error('Error fetching student documents:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Save/Update assessment inside a course (supports knowledge or practical type)
// @route   PUT /api/courses/:courseId/assessment/:type
// @access  Private
exports.saveCourseAssessment = async (req, res) => {
  try {
    const { courseId, type } = req.params; // type = 'knowledge' or 'practical'
    const { html, canvasBlocks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isPractical = type === 'practical' || type === 'ass4';
    const fieldName = isPractical ? 'practicalAssessment' : 'knowledgeAssessment';

    const slug = course[fieldName]?.slug || generateSlug(`${course.title}-${isPractical ? 'practical' : 'knowledge'}`);

    course[fieldName] = {
      slug,
      html: html || '',
      canvasBlocks: canvasBlocks || [],
      updatedAt: new Date(),
    };

    await course.save();

    return res.status(200).json({
      success: true,
      message: `${isPractical ? 'Practical' : 'Knowledge'} assessment saved successfully`,
      slug: course[fieldName].slug,
      courseId: course._id,
    });
  } catch (err) {
    console.error('Error saving assessment:', err);
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

// @desc    Get assessment by slug (For student/public viewer)
// @route   GET /api/courses/assessment/slug/:slug
// @access  Public
exports.getAssessmentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({
      $or: [{ 'knowledgeAssessment.slug': slug }, { 'practicalAssessment.slug': slug }]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Assessment not found for this slug' });
    }

    const assessment = course.knowledgeAssessment?.slug === slug 
      ? course.knowledgeAssessment 
      : course.practicalAssessment;

    return res.status(200).json({
      success: true,
      courseTitle: course.title,
      slug: assessment.slug,
      html: assessment.html,
      updatedAt: assessment.updatedAt,
    });
  } catch (err) {
    console.error('Error finding assessment by slug:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};