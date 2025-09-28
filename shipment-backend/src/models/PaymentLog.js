// src/models/PaymentLog.js
const mongoose = require('mongoose');

const PaymentLogSchema = new mongoose.Schema({
  // Reference to company
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
    index: true
  },
  
  // Payment gateway information
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  
  gatewayOrderId: {
    type: String,
    required: [true, 'Gateway Order ID is required'],
    trim: true,
    index: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    default: 1500000, // ₹15,000 in paisa for Razorpay
    min: [0, 'Amount cannot be negative']
  },
  
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    uppercase: true
  },
  
  // Payment status tracking
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'cancelled', 'refunded', 'disputed'],
    default: 'created',
    index: true
  },
  
  // Payment method information
  paymentMethod: {
    type: String,
    enum: ['card', 'netbanking', 'upi', 'wallet', 'emi', 'paylater'],
    default: null
  },
  
  // Gateway response data
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Error handling
  failureReason: {
    type: String,
    default: null,
    maxLength: [500, 'Failure reason cannot exceed 500 characters']
  },
  
  errorCode: {
    type: String,
    default: null,
    maxLength: [50, 'Error code cannot exceed 50 characters']
  },
  
  // Timing information
  paidAt: {
    type: Date,
    default: null,
    index: true
  },
  
  attemptedAt: {
    type: Date,
    default: null
  },
  
  failedAt: {
    type: Date,
    default: null
  },
  
  refundedAt: {
    type: Date,
    default: null
  },
  
  // Refund information
  refundId: {
    type: String,
    default: null,
    sparse: true
  },
  
  refundAmount: {
    type: Number,
    default: null,
    min: [0, 'Refund amount cannot be negative']
  },
  
  refundReason: {
    type: String,
    default: null,
    maxLength: [200, 'Refund reason cannot exceed 200 characters']
  },
  
  // Customer information
  customerInfo: {
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
    },
    name: {
      type: String,
      maxLength: [100, 'Customer name cannot exceed 100 characters']
    }
  },
  
  // Billing address
  billingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  // Transaction fees and charges
  gatewayFee: {
    type: Number,
    default: 0,
    min: [0, 'Gateway fee cannot be negative']
  },
  
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  
  netAmount: {
    type: Number,
    default: 0,
    min: [0, 'Net amount cannot be negative']
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // IP and device information
  ipAddress: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        if (!v) return true;
        // Basic IPv4 and IPv6 validation
        return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/.test(v);
      },
      message: 'Invalid IP address format'
    }
  },
  
  userAgent: {
    type: String,
    default: null,
    maxLength: [500, 'User agent cannot exceed 500 characters']
  },
  
  // Webhook information
  webhookReceived: {
    type: Boolean,
    default: false
  },
  
  webhookData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  webhookReceivedAt: {
    type: Date,
    default: null
  },
  
  // Settlement information
  settled: {
    type: Boolean,
    default: false
  },
  
  settlementId: {
    type: String,
    default: null,
    sparse: true
  },
  
  settledAt: {
    type: Date,
    default: null
  },
  
  // Reconciliation
  reconciled: {
    type: Boolean,
    default: false
  },
  
  reconciledAt: {
    type: Date,
    default: null
  },
  
  // Notes and comments
  internalNotes: [{
    note: {
      type: String,
      required: true,
      maxLength: [500, 'Note cannot exceed 500 characters']
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
PaymentLogSchema.index({ paymentId: 1 }, { unique: true });
PaymentLogSchema.index({ gatewayOrderId: 1 });
PaymentLogSchema.index({ companyId: 1, status: 1 });
PaymentLogSchema.index({ status: 1, createdAt: -1 });
PaymentLogSchema.index({ paidAt: -1 });
PaymentLogSchema.index({ amount: 1, currency: 1 });

// Compound indexes
PaymentLogSchema.index({ status: 1, paidAt: -1 });
PaymentLogSchema.index({ companyId: 1, status: 1, createdAt: -1 });
PaymentLogSchema.index({ settled: 1, settledAt: -1 });
PaymentLogSchema.index({ reconciled: 1, reconciledAt: -1 });

// Virtual for formatted amount
PaymentLogSchema.virtual('formattedAmount').get(function() {
  if (this.currency === 'INR') {
    return `₹${(this.amount / 100).toLocaleString('en-IN')}`;
  } else if (this.currency === 'USD') {
    return `$${(this.amount / 100).toLocaleString('en-US')}`;
  } else {
    return `${this.amount / 100} ${this.currency}`;
  }
});

// Virtual for payment duration
PaymentLogSchema.virtual('paymentDuration').get(function() {
  if (this.paidAt && this.createdAt) {
    return this.paidAt.getTime() - this.createdAt.getTime();
  }
  return null;
});

// Virtual for settlement duration
PaymentLogSchema.virtual('settlementDuration').get(function() {
  if (this.settledAt && this.paidAt) {
    return this.settledAt.getTime() - this.paidAt.getTime();
  }
  return null;
});

// Pre-save middleware
PaymentLogSchema.pre('save', function(next) {
  // Calculate net amount if not set
  if (this.isNew || this.isModified(['amount', 'gatewayFee', 'taxAmount'])) {
    this.netAmount = this.amount - this.gatewayFee - this.taxAmount;
  }
  
  // Set timestamps based on status changes
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'attempted':
        if (!this.attemptedAt) this.attemptedAt = now;
        break;
      case 'paid':
        if (!this.paidAt) this.paidAt = now;
        break;
      case 'failed':
        if (!this.failedAt) this.failedAt = now;
        break;
      case 'refunded':
        if (!this.refundedAt) this.refundedAt = now;
        break;
    }
  }
  
  next();
});

// Static methods
PaymentLogSchema.statics.findByCompany = function(companyId) {
  return this.find({ companyId }).sort({ createdAt: -1 });
};

PaymentLogSchema.statics.findSuccessfulPayments = function() {
  return this.find({ status: 'paid' }).sort({ paidAt: -1 });
};

PaymentLogSchema.statics.findFailedPayments = function() {
  return this.find({ status: 'failed' }).sort({ failedAt: -1 });
};

PaymentLogSchema.statics.getPaymentStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);
};

PaymentLogSchema.statics.getRevenueByPeriod = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        status: 'paid',
        paidAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' },
          day: { $dayOfMonth: '$paidAt' }
        },
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        avgTransactionValue: { $avg: '$amount' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);
};

// Instance methods
PaymentLogSchema.methods.markAsPaid = function(gatewayResponse = {}) {
  this.status = 'paid';
  this.paidAt = new Date();
  this.gatewayResponse = { ...this.gatewayResponse, ...gatewayResponse };
  return this.save();
};

PaymentLogSchema.methods.markAsFailed = function(reason, errorCode = null) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.failureReason = reason;
  this.errorCode = errorCode;
  return this.save();
};

PaymentLogSchema.methods.initiateRefund = function(amount, reason) {
  this.refundAmount = amount || this.amount;
  this.refundReason = reason;
  return this.save();
};

PaymentLogSchema.methods.markAsRefunded = function(refundId) {
  this.status = 'refunded';
  this.refundedAt = new Date();
  this.refundId = refundId;
  return this.save();
};

PaymentLogSchema.methods.addInternalNote = function(note, adminId) {
  this.internalNotes.push({
    note: note,
    addedBy: adminId,
    addedAt: new Date()
  });
  return this.save();
};

PaymentLogSchema.methods.markAsSettled = function(settlementId) {
  this.settled = true;
  this.settlementId = settlementId;
  this.settledAt = new Date();
  return this.save();
};

PaymentLogSchema.methods.markAsReconciled = function() {
  this.reconciled = true;
  this.reconciledAt = new Date();
  return this.save();
};

module.exports = mongoose.model('PaymentLog', PaymentLogSchema);