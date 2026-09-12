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

// Hash password before save, only if modified.
// NOTE: this is an async function, so Mongoose treats the returned Promise
// as the completion signal — it does NOT pass a `next` callback in.
// Do not declare or call `next()` here; that mix throws
// "TypeError: next is not a function".
teacherSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

teacherSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);