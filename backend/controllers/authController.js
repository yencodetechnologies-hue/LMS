const User = require('../models/User');
const Order = require('../models/Order');
const Teacher = require('../models/Teacher');
const StudentSubmission = require('../models/StudentSubmission');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_jwt_secret_key_2026',
    { expiresIn: '8h' }
  );

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const lowerEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: lowerEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role || 'student' },
    });
  } catch (error) {
    console.error('Signup Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. Find user in the User collection
    let user = await User.findOne({ email: lowerEmail });

    // Track original role type for fallback creation
    let detectedRole = 'student';

    // 2. Fallback: Check Order table, StudentSubmission table, then Teacher table if not found
    if (!user) {
      const orderMatch = await Order.findOne({ email: lowerEmail });
      if (orderMatch) {
        detectedRole = orderMatch.role ? orderMatch.role.toLowerCase() : 'rto';
        const hashedPassword = await bcrypt.hash('123456', 10);
        user = await User.create({
          name: orderMatch.name,
          email: lowerEmail,
          password: hashedPassword,
          role: ['student', 'rto', 'admin'].includes(detectedRole) ? detectedRole : 'rto'
        });
      } else {
        const studentMatch = await StudentSubmission.findOne({ 'student.studentEmail': lowerEmail });
        if (studentMatch) {
          detectedRole = 'student';
          const hashedPassword = await bcrypt.hash('123456', 10);
          user = await User.create({
            name: studentMatch.student.studentName,
            email: lowerEmail,
            password: hashedPassword,
            role: 'student'
          });
        } else {
          const teacherMatch = await Teacher.findOne({ email: lowerEmail });
          if (teacherMatch) {
            detectedRole = 'teacher';
            const hashedPassword = await bcrypt.hash('123456', 10);
            // If User model schema enum throws on 'teacher', map fallback role to 'rto' or 'student' in DB, 
            // but let userProfile output 'teacher'
            user = await User.create({
              name: teacherMatch.name,
              email: lowerEmail,
              password: hashedPassword,
              role: 'rto', 
              rtoNumber: teacherMatch.rtoNumber || ''
            });
          } else {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
          }
        }
      }
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 4. Fetch the latest metadata from Order, StudentSubmission, or Teacher tables
    const orderData = await Order.findOne({ email: lowerEmail }).sort({ createdAt: -1 });
    const studentData = !orderData ? await StudentSubmission.findOne({ 'student.studentEmail': lowerEmail }).sort({ createdAt: -1 }) : null;
    const teacherData = (!orderData && !studentData) ? await Teacher.findOne({ email: lowerEmail }).sort({ createdAt: -1 }) : null;

    // Determine final role for token/profile response
    let finalRole = user.role;
    if (orderData) {
      finalRole = orderData.role ? orderData.role.toLowerCase() : 'rto';
    } else if (studentData) {
      finalRole = 'student';
    } else if (teacherData) {
      finalRole = 'teacher';
    }

    // 5. Construct user profile response incorporating source-specific data
    const userProfile = {
      id: user._id,
      name: orderData ? orderData.name : (studentData ? studentData.student.studentName : (teacherData ? teacherData.name : user.name)),
      email: user.email,
      role: finalRole,
      rtoNumber: orderData ? orderData.rtoNumber : (studentData ? studentData.rtoId : (teacherData ? teacherData.rtoNumber : (user.rtoNumber || ''))),
      instituteName: orderData ? orderData.instituteName : (user.instituteName || ''),
      payStatus: orderData ? orderData.payStatus : 1,
      courses: orderData ? orderData.courses : (studentData ? [studentData.courseId] : [])
    };

    const token = generateToken(userProfile);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Login Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
};
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const orderData = await Order.findOne({ email: user.email.toLowerCase() }).sort({ createdAt: -1 });
    const studentData = !orderData ? await StudentSubmission.findOne({ 'student.studentEmail': user.email.toLowerCase() }).sort({ createdAt: -1 }) : null;
    
    const userProfile = {
      id: user._id,
      name: orderData ? orderData.name : (studentData ? studentData.student.studentName : user.name),
      email: user.email,
      role: orderData ? orderData.role.toLowerCase() : (studentData ? 'student' : (user.role || 'student')),
      rtoNumber: orderData ? orderData.rtoNumber : (studentData ? studentData.rtoId : (user.rtoNumber || '')),
      instituteName: orderData ? orderData.instituteName : (user.instituteName || ''),
      payStatus: orderData ? orderData.payStatus : 1,
      courses: orderData ? orderData.courses : (studentData ? [studentData.courseId] : [])
    };

    return res.status(200).json({ success: true, user: userProfile });
  } catch (error) {
    console.error('GetMe Error:', error.stack || error);
    return res.status(500).json({ success: false, message: 'Internal server error fetching profile' });
  }
};