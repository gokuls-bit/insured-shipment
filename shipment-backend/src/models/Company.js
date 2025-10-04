// src/models/Company.js - Company Model Schema
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  website: {
    type: String,
    required: [true, 'Website is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  established: {
    type: Number,
    min: [1800, 'Year must be after 1800']
  },
  coverage: {
    type: String,
    enum: ['Global', 'Asia-Pacific', 'Europe', 'Americas', 'India-Specific'],
    default: 'Global'
  },
  maxCoverageAmount: {
    type: Number,
    required: [true, 'Maximum coverage amount is required']
  },
  maxCoverageCurrency: {
    type: String,
    enum: ['USD', 'EUR', 'INR'],
    default: 'USD'
  },
  routes: [{
    type: String,
    trim: true
  }],
  cargoTypes: [{
    type: String,
    trim: true
  }],
  shipmentTypes: [{
    type: String,
    enum: ['Road', 'Rail', 'Ship', 'Air'],
    trim: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  claimSettlement: {
    type: String,
    default: 'N/A'
  },
  pricing: {
    type: String,
    default: 'Pending Review'
  },
  serviceTier: {
    type: String,
    enum: ['Standard', 'Premium', 'Premium Plus'],
    default: 'Standard'
  },
  clicks: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  quotes: {
    type: Number,
    default: 0
  },
  submittedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    designation: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ status: 1 });
companySchema.index({ paymentStatus: 1 });
companySchema.index({ routes: 1 });
companySchema.index({ cargoTypes: 1 });
companySchema.index({ shipmentTypes: 1 });

// Method to increment clicks
companySchema.methods.incrementClicks = function() {
  this.clicks += 1;
  return this.save();
};

// Method to increment views
companySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;