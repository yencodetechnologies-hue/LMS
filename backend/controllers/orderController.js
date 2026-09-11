const Order = require('../models/Order');
const User = require('../models/User');
const { uploadStream } = require('../config/cloudinary');
const bcrypt = require('bcryptjs');

exports.createOrder = async (req, res) => {
  try {
    const { name, email, instituteName, rtoNumber, role, courses, payStatus } = req.body;

    const lowerEmail = email.toLowerCase();

    // 1. Check if a User account already exists for this email
    let user = await User.findOne({ email: lowerEmail });
    if (!user) {
      // Create a default user account with password "123456" so they can log in
      const hashedPassword = await bcrypt.hash('123456', 10);
      user = await User.create({
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: role || 'rto'
      });
    }

    // 2. Create the Order record
    const newOrder = new Order({
      user: user._id,
      name,
      email: lowerEmail,
      instituteName,
      rtoNumber,
      role: role || 'rto',
      courses: courses || [],
      payStatus: payStatus !== undefined ? payStatus : 1
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully and user account initialized',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Server error while processing order', error: error.message });
  }
};

exports.updateRtoLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const email = req.user.email.toLowerCase();

    // 1. Upload file buffer to Cloudinary using your helper
    const uploadResult = await uploadStream(req.file.buffer, 'rto-logos');
    const cloudinarySecureUrl = uploadResult.secure_url;

    // 2. Update the latest order record with the new logo URL
    const order = await Order.findOne({ email }).sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order profile not found' });
    }

    order.logo = cloudinarySecureUrl;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Logo updated successfully',
      logo: order.logo
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return res.status(500).json({ success: false, message: 'Server error while uploading logo' });
  }
};

exports.getRtoProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order by ID or fallback to email if ID is user ID
    let order = await Order.findById(id);
    if (!order) {
      // If the ID passed was the User ID, find the latest order matching the user's email
      const User = require('../models/User');
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      order = await Order.findOne({ email: user.email.toLowerCase() }).sort({ createdAt: -1 });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order profile not found' });
    }

    return res.status(200).json({
      success: true,
      profile: {
        id: order._id,
        name: order.name,
        email: order.email,
        rtoNumber: order.rtoNumber,
        instituteName: order.instituteName,
        logo: order.logo || ''
      }
    });
  } catch (error) {
    console.error('Error fetching RTO profile by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
};

exports.getRtoUsers = async (req, res) => {
  try {
    // Populate the courses array with full Course document details
    const users = await Order.find({})
      .populate('courses')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching RTO users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching RTO users'
    });
  }
};