// src/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [3, 'Username must be at least 3 characters'],
    maxLength: [30, 'Username cannot exceed 30 characters'],
    match: [
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ]
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters'],
    maxLength: [128, 'Password cannot exceed 128 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Admin profile information
  firstName: {
    type: String,
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  
  // Role and permissions
  role: {
    type: String,
    enum: ['admin', 'super_admin', 'moderator'],
    default: 'admin'
  },
  
  permissions: [{
    type: String,
    enum: [
      'view_companies',
      'approve_companies',
      'reject_companies',
      'delete_companies',
      'view_payments',
      'manage_admins',
      'view_analytics',
      'manage_settings',
      'export_data'
    ]
  }],
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Security and session management
  lastLogin: {
    type: Date,
    default: null
  },
  
  lastLoginIP: {
    type: String,
    default: null
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date,
    default: null
  },
  
  // Password reset
  resetPasswordToken: {
    type: String,
    select: false
  },
  
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  
  // Email verification
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  // Activity tracking
  actionsPerformed: {
    type: Number,
    default: 0
  },
  
  companiesApproved: {
    type: Number,
    default: 0
  },
  
  companiesRejected: {
    type: Number,
    default: 0
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'de'],
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    dashboardLayout: {
      type: String,
      enum: ['compact', 'comfortable', 'spacious'],
      default: 'comfortable'
    }
  },
  
  // Avatar and profile
  avatar: {
    type: String,
    default: null
  },
  
  bio: {
    type: String,
    maxLength: [200, 'Bio cannot exceed 200 characters'],
    trim: true
  },
  
  // Department and contact
  department: {
    type: String,
    trim: true,
    maxLength: [50, 'Department cannot exceed 50 characters']
  },
  
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  
  // Creation and management
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
AdminSchema.index({ username: 1 }, { unique: true });
AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });
AdminSchema.index({ lastLogin: -1 });
AdminSchema.index({ createdAt: -1 });

// Compound indexes
AdminSchema.index({ isActive: 1, role: 1 });
AdminSchema.index({ lastLogin: -1, isActive: 1 });

// Virtual for full name
AdminSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Virtual for account lock status
AdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for maximum login attempts
AdminSchema.virtual('maxLoginAttempts').get(function() {
  return 5; // Can be made configurable
});

// Pre-save middleware for password hashing
AdminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for setting default permissions
AdminSchema.pre('save', function(next) {
  if (this.isNew && this.permissions.length === 0) {
    // Set default permissions based on role
    switch (this.role) {
      case 'super_admin':
        this.permissions = [
          'view_companies', 'approve_companies', 'reject_companies', 'delete_companies',
          'view_payments', 'manage_admins', 'view_analytics', 'manage_settings', 'export_data'
        ];
        break;
      case 'admin':
        this.permissions = [
          'view_companies', 'approve_companies', 'reject_companies',
          'view_payments', 'view_analytics'
        ];
        break;
      case 'moderator':
        this.permissions = ['view_companies', 'approve_companies', 'reject_companies'];
        break;
      default:
        this.permissions = ['view_companies'];
    }
  }
  
  // Update last activity
  this.lastActivity = new Date();
  next();
});

// Instance method to check password
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to generate JWT token
AdminSchema.methods.getJWTToken = function() {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    permissions: this.permissions
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'surakshitsafar',
      audience: 'surakshitsafar-admin'
    }
  );
};

// Instance method to increment login attempts
AdminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have hit max attempts and it's not locked, lock the account
  if (this.loginAttempts + 1 >= this.maxLoginAttempts && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // Lock for 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
AdminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

// Instance method to record successful login
AdminSchema.methods.recordLogin = function(ipAddress) {
  this.lastLogin = new Date();
  this.lastLoginIP = ipAddress;
  this.actionsPerformed += 1;
  return this.save();
};

// Instance method to check permission
AdminSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'super_admin';
};

// Instance method to record company action
AdminSchema.methods.recordCompanyAction = function(action) {
  if (action === 'approve') {
    this.companiesApproved += 1;
  } else if (action === 'reject') {
    this.companiesRejected += 1;
  }
  this.actionsPerformed += 1;
  this.lastActivity = new Date();
  return this.save();
};

// Static method to find active admins
AdminSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ lastLogin: -1 });
};

// Static method to find admins by role
AdminSchema.statics.findByRole = function(role) {
  return this.find({ role: role, isActive: true });
};

// Static method to get admin statistics
AdminSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalActions: { $sum: '$actionsPerformed' },
        totalApprovals: { $sum: '$companiesApproved' },
        totalRejections: { $sum: '$companiesRejected' }
      }
    }
  ]);
};

module.exports = mongoose.model('Admin', AdminSchema);