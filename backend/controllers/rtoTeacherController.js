const Teacher = require('../models/Teacher'); // Ensure you have a Teacher model or use your user/teacher schema
const mongoose = require('mongoose');

// @desc    Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching teachers' });
  }
};

// @desc    Create a teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, rtoNumber } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const newTeacher = await Teacher.create({ name, email, phone, subject, rtoNumber });
    return res.status(201).json({ success: true, message: 'Teacher created successfully', teacher: newTeacher });
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

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
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