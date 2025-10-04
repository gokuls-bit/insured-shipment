// src/models/Shipment.js - Shipment Model Schema
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Road', 'Rail', 'Ship', 'Air'],
    required: [true, 'Shipment type is required']
  },
  origin: {
    country: { type: String, required: true },
    port: { type: String, required: true }
  },
  destination: {
    country: { type: String, required: true },
    port: { type: String, required: true }
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required']
  },
  cargoType: {
    type: String,
    required: [true, 'Cargo type is required'],
    trim: true
  },
  cargoDescription: {
    type: String,
    trim: true
  },
  insuredAmount: {
    type: Number,
    required: [true, 'Insured amount is required'],
    min: [0, 'Insured amount must be positive']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'INR'],
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delivered', 'cancelled', 'lost', 'damaged'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  },
  departureDate: {
    type: Date,
    required: [true, 'Departure date is required']
  },
  arrivalDate: {
    type: Date,
    required: [true, 'Arrival date is required']
  },
  actualArrivalDate: {
    type: Date
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
shipmentSchema.index({ companyId: 1 });
shipmentSchema.index({ createdBy: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ 'origin.port': 1, 'destination.port': 1 });
shipmentSchema.index({ departureDate: 1 });

// Virtual for duration in days
shipmentSchema.virtual('durationDays').get(function() {
  if (this.departureDate && this.arrivalDate) {
    const diff = this.arrivalDate - this.departureDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Generate tracking number before saving
shipmentSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;