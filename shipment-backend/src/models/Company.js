// src/models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxLength: [100, 'Company name cannot exceed 100 characters'],
    minLength: [2, 'Company name must be at least 2 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  
  website: {
    type: String,
    required: [true, 'Website URL is required'],
    match: [
      /^https?:\/\/.+\..+/,
      'Please provide a valid website URL'
    ]
  },
  
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true,
    minLength: [10, 'Contact number must be at least 10 characters']
  },
  
  // Enhanced route system
  routes: [{
    type: String,
    required: true,
    validate: {
      validator: function(route) {
        // Validate route format: "Origin-Destination"
        return /^[A-Za-z\s]+-[A-Za-z\s]+$/.test(route);
      },
      message: 'Route must be in format "Origin-Destination"'
    }
  }],
  
  // Cargo types the company can insure
  cargoTypes: [{
    type: String,
    enum: [
      'Electronics', 'Textiles', 'Machinery', 'Chemicals', 'Automotive',
      'Food Products', 'Pharmaceuticals', 'Oil & Gas', 'Raw Materials',
      'Mining Equipment', 'Agricultural Products', 'Bulk Commodities',
      'Consumer Goods', 'Medical Equipment', 'Hazardous Materials'
    ],
    required: true
  }],
  
  shipmentTypes: [{
    type: String,
    enum: ['Road', 'Rail', 'Ship', 'Air'],
    required: true
  }],
  
  // Coverage information
  coverage: {
    type: String,
    default: 'Regional',
    enum: ['Local', 'Regional', 'National', 'International', 'Global']
  },
  
  maxCoverage: {
    amount: {
      type: Number,
      default: 1000000,
      min: [10000, 'Minimum coverage should be $10,000']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'INR', 'GBP', 'AUD']
    }
  },
  
  // Company metrics
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  established: {
    type: Number,
    required: [true, 'Establishment year is required'],
    min: [1900, 'Invalid establishment year'],
    max: [new Date().getFullYear(), 'Establishment year cannot be in the future']
  },
  
  claimSettlementRate: {
    type: String,
    default: '0%',
    match: [/^\d{1,3}%$/, 'Claim settlement rate must be in percentage format (e.g., 95%)']
  },
  
  // Status and verification
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  verified: {
    type: Boolean,
    default: false
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  paymentId: {
    type: String,
    default: null,
    sparse: true // Allows multiple null values
  },
  
  paymentAmount: {
    type: Number,
    default: 1500000, // ₹15,000 in paisa for Razorpay
    min: [0, 'Payment amount cannot be negative']
  },
  
  // Analytics
  clickCount: {
    type: Number,
    default: 0,
    min: [0, 'Click count cannot be negative']
  },
  
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  
  quoteRequests: {
    type: Number,
    default: 0,
    min: [0, 'Quote requests cannot be negative']
  },
  
  // Submission details
  submittedBy: {
    name: {
      type: String,
      required: [true, 'Submitter name is required'],
      trim: true,
      maxLength: [50, 'Submitter name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Submitter email is required'],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid submitter email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Submitter phone is required'],
      trim: true,
      minLength: [10, 'Phone number must be at least 10 characters']
    },
    designation: {
      type: String,
      trim: true,
      maxLength: [50, 'Designation cannot exceed 50 characters']
    }
  },
  
  // Company description
  description: {
    type: String,
    maxLength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  
  // Additional company information
  licenseNumber: {
    type: String,
    trim: true,
    maxLength: [50, 'License number cannot exceed 50 characters']
  },
  
  headquartersAddress: {
    type: String,
    trim: true,
    maxLength: [200, 'Address cannot exceed 200 characters']
  },
  
  // Admin actions
  approvedAt: {
    type: Date,
    default: null
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  rejectionReason: {
    type: String,
    maxLength: [500, 'Rejection reason cannot exceed 500 characters'],
    trim: true
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
CompanySchema.index({ status: 1, paymentStatus: 1 });
CompanySchema.index({ routes: 1 });
CompanySchema.index({ cargoTypes: 1 });
CompanySchema.index({ shipmentTypes: 1 });
CompanySchema.index({ name: 'text', description: 'text' });
CompanySchema.index({ 'submittedBy.email': 1 });
CompanySchema.index({ createdAt: -1 });
CompanySchema.index({ rating: -1 });

// Compound indexes
CompanySchema.index({ status: 1, verified: 1, rating: -1 });
CompanySchema.index({ paymentStatus: 1, status: 1 });

// Virtual for formatted coverage amount
CompanySchema.virtual('formattedMaxCoverage').get(function() {
  const amount = this.maxCoverage.amount;
  const currency = this.maxCoverage.currency;
  
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${currency}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${currency}`;
  }
  return `${amount} ${currency}`;
});

// Virtual for company age
CompanySchema.virtual('companyAge').get(function() {
  return new Date().getFullYear() - this.established;
});

// Pre-save middleware
CompanySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Auto-verify if payment is completed and status is approved
  if (this.paymentStatus === 'completed' && this.status === 'approved') {
    this.verified = true;
  }
  
  next();
});

// Static methods
CompanySchema.statics.findByRoute = function(departure, arrival) {
  const routePattern = new RegExp(`${departure}.*${arrival}|${arrival}.*${departure}`, 'i');
  return this.find({ routes: { $regex: routePattern } });
};

CompanySchema.statics.findByCargoType = function(cargoType) {
  return this.find({ cargoTypes: cargoType });
};

CompanySchema.statics.getVerifiedCompanies = function() {
  return this.find({ 
    status: 'approved', 
    paymentStatus: 'completed', 
    verified: true 
  }).sort({ rating: -1, createdAt: -1 });
};

CompanySchema.statics.getTopRatedCompanies = function(limit = 10) {
  return this.find({ 
    status: 'approved', 
    verified: true 
  }).sort({ rating: -1, clickCount: -1 }).limit(limit);
};

// Instance methods
CompanySchema.methods.incrementClicks = function() {
  this.clickCount += 1;
  return this.save();
};

CompanySchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

CompanySchema.methods.requestQuote = function() {
  this.quoteRequests += 1;
  return this.save();
};

CompanySchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.approvedBy = adminId;
  if (this.paymentStatus === 'completed') {
    this.verified = true;
  }
  return this.save();
};

CompanySchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.approvedBy = adminId;
  return this.save();
};

module.exports = mongoose.model('Company', CompanySchema);