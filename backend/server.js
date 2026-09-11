require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/Courseroutes');
const orderRoutes = require('./routes/orderRoutes');
const jobPackRoutes = require('./routes/jobPackRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

connectDB();

app.use(cors());

// Increased payload limit to handle large assessment blocks and templates
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/orders/', orderRoutes);
app.use('/api/jobpack', jobPackRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rto/teachers', teacherRoutes);

const PORT = process.env.PORT || 2034;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));