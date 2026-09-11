const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  instituteName: { type: String, required: true },
  rtoNumber: { type: String, required: true },
  role: { type: String, default: 'Student' },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  payStatus: { type: Number, default: 1 },
  logo: { type: String, default: '' }, // Added logo field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);