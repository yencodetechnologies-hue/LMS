const Teacher = require('../models/Teacher');
const mongoose = require('mongoose');

// @desc    Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
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

    const teacher = await Teacher.findById(id).populate('courses', 'name');
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

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await Teacher.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A teacher with this email already exists' });
    }

    const newTeacher = await Teacher.create({
      name,
      email,
      password,
      phone,
      subject,
      rtoNumber,
      instituteName,
      payStatus,
      courses
    });

    const teacherResponse = newTeacher.toObject();
    delete teacherResponse.password;

    return res.status(201).json({ success: true, message: 'Teacher created successfully', teacher: teacherResponse });
  } catch (error) {
    console.error('Error creating teacher:', error);
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

    // Never let a plain PATCH silently update the password hash
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