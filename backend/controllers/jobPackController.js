// Backend: controllers/jobPackController.js
const Order = require('../models/Order');
const Course = require('../models/Course');

exports.getJobPackData = async (req, res) => {
  try {
    const { rtoNumber, courseId } = req.params;

    // 1. Find the order matching the RTO number
    const order = await Order.findOne({ rtoNumber: rtoNumber.trim() }).sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({ success: false, message: 'RTO order profile not found' });
    }

    // 2. Find the course matching the courseId and return all fields
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order._id,
        name: order.name,
        email: order.email,
        rtoNumber: order.rtoNumber,
        instituteName: order.instituteName,
        logo: order.logo || ''
      },
      course: course.toObject() // Returns the full course document including assessments, URLs, and canvas blocks
    });
  } catch (error) {
    console.error('Error fetching job pack data:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching job pack data' });
  }
};