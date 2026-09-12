const Teacher = require('../models/Teacher');
const mongoose = require('mongoose');
const crypto = require('crypto');

// @desc    Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .select('-password') // never expose password hash
      .populate('courses', 'name') // adjust field to match your Course schema
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching teachers' });
  }
};

// @desc    Get single teacher by id
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid teacher ID format' });
    }

    const teacher = await Teacher.findById(id)
      .select('-password') // never expose password hash
      .populate('courses', 'name');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    return res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching teacher' });
  }
};

// @desc    Create a teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, phone, subject, rtoNumber, instituteName, payStatus, courses } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    if (!rtoNumber) {
      return res.status(400).json({ success: false, message: 'RTO number is required' });
    }

    const existing = await Teacher.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A teacher with this email already exists' });
    }

    // Generate a random temporary password server-side if none was supplied.
    // Never trust a client-supplied default/hardcoded password.
    const tempPassword = password || crypto.randomBytes(6).toString('hex');

    const newTeacher = await Teacher.create({
      name,
      email: email.toLowerCase(),
      password: tempPassword,
      phone,
      subject,
      rtoNumber: rtoNumber.trim(),
      instituteName,
      payStatus,
      courses
    });

    const teacherResponse = newTeacher.toObject();
    delete teacherResponse.password;

    return res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher: teacherResponse,
      // Only returned once, at creation time, so an admin can share it with the teacher.
      temporaryPassword: password ? undefined : tempPassword
    });
  } catch (error) {
    console.error('Error creating teacher:', error);

    // Surface specific, safe error types instead of a generic 500.
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({ success: false, message: `A teacher with this ${field} already exists` });
    }

    return res.status(500).json({ success: false, message: 'Server error while creating teacher' });
  }
};

// @desc    Update a teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid teacher ID format' });
    }

    // Never let a plain PATCH/PUT silently update the password hash
    const updates = { ...req.body };
    delete updates.password;

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedTeacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    return res.status(200).json({ success: true, message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating teacher' });
  }
};

// @desc    Delete a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid teacher ID format' });
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    return res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return res.status(500).json({ success: false, message: 'Server error while deleting teacher' });
  }
};