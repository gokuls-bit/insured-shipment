const mongoose = require('mongoose');

// Admin schema with roles matching seed and security best practices
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'moderator'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true }
}, {
  timestamps: true,
  collection: 'admins'
});

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);