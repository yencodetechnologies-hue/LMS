const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true, default: '' },
    subject: { type: String, trim: true, default: '' },
    rtoNumber: { type: String, trim: true, default: '' },
    instituteName: { type: String, trim: true, default: '' },
    role: { type: String, default: 'teacher' },
    payStatus: { type: Number, enum: [0, 1], default: 0 }, // 0 = unpaid/inactive, 1 = active
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
  },
  { timestamps: true }
);

// Hash password before save, only if modified
teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

teacherSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);