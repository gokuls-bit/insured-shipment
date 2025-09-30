// src/controllers/paymentController.js
const crypto = require('crypto');
const Company = require('../models/Company');
const PaymentLog = require('../models/PaymentLog');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// NOTE: The project previously contained a full mock implementation of the
// payment controller (mock order creation, verification, webhooks, refund,
// analytics) which duplicated the real/Razorpay-backed implementations later
// in this file. That caused duplicate identifier errors when Node loaded the
// module. The mock implementation was removed here so only the single set of
// (Razorpay) implementations remain below. If you need a mock mode, we can
// implement conditional routing or rename the mock functions.

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { companyId, amount, currency = 'INR' } = req.body;
    const finalAmount = amount || 1500000; // Default ₹15,000 in paisa

    // Verify company exists and is eligible for payment
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if payment already completed
    if (company.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this company',
        currentStatus: company.paymentStatus
      });
    }

    // Check if there's already a pending payment order
    const existingPayment = await PaymentLog.findOne({
      companyId,
      status: { $in: ['created', 'attempted'] }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment order already exists for this company',
        existingOrderId: existingPayment.gatewayOrderId,
        paymentId: existingPayment.paymentId
      });
    }

    // Create unique receipt ID
    const receiptId = `company_${companyId}_${Date.now()}`;

    // Prepare Razorpay order options
    const orderOptions = {
      amount: finalAmount, // amount in paisa
      currency: currency.toUpperCase(),
      receipt: receiptId,
      notes: {
        companyId: companyId.toString(),
        companyName: company.name,
        submitterEmail: company.submittedBy.email,
        purpose: 'Company listing fee'
      },
      partial_payment: false
    };

    // Create order with Razorpay
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Create payment log entry
    const paymentLogData = {
      companyId,
      paymentId: razorpayOrder.id,
      gatewayOrderId: razorpayOrder.id,
      amount: finalAmount,
      currency: currency.toUpperCase(),
      status: 'created',
      customerInfo: {
        email: company.submittedBy.email,
        phone: company.submittedBy.phone,
        name: company.submittedBy.name
      },
      metadata: {
        companyName: company.name,
        receiptId,
        createdVia: 'web_portal'
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const paymentLog = new PaymentLog(paymentLogData);
    await paymentLog.save();

    // Update company with payment order ID
    company.paymentId = razorpayOrder.id;
    company.paymentStatus = 'processing';
    await company.save();

    logger.info('Payment order created', {
      companyId,
      companyName: company.name,
      orderId: razorpayOrder.id,
      amount: finalAmount,
      currency
    });

    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        companyName: company.name,
        companyId,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        customerInfo: {
          email: company.submittedBy.email,
          phone: company.submittedBy.phone,
          name: company.submittedBy.name
        },
        notes: razorpayOrder.notes,
        receipt: razorpayOrder.receipt,
        createdAt: razorpayOrder.created_at
      }
    });

  } catch (error) {
    logger.error('Payment order creation error:', error);
    
    // Handle Razorpay specific errors
    if (error.error) {
      return res.status(400).json({
        success: false,
        message: 'Payment gateway error',
        error: error.error.description || 'Unknown payment gateway error',
        code: error.error.code
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Verify payment signature and update status
const verifyPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { 
      paymentId, 
      orderId, 
      signature,
      paymentMethod = null,
      additionalData = {}
    } = req.body;

    // Verify the payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      logger.warn('Payment signature verification failed', {
        orderId,
        paymentId,
        providedSignature: signature,
        expectedSignature: generatedSignature
      });

      // Mark payment as failed
      await PaymentLog.findOneAndUpdate(
        { gatewayOrderId: orderId },
        { 
          status: 'failed',
          failedAt: new Date(),
          failureReason: 'Invalid payment signature',
          errorCode: 'SIGNATURE_VERIFICATION_FAILED',
          gatewayResponse: { paymentId, signature }
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: 'Invalid signature'
      });
    }

    // Fetch additional payment details from Razorpay
    let razorpayPayment;
    try {
      razorpayPayment = await razorpay.payments.fetch(paymentId);
    } catch (fetchError) {
      logger.error('Error fetching payment details from Razorpay:', fetchError);
      razorpayPayment = null;
    }

    // Find and update payment log
    const paymentLog = await PaymentLog.findOneAndUpdate(
      { gatewayOrderId: orderId },
      { 
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: paymentMethod || razorpayPayment?.method,
        gatewayResponse: {
          paymentId,
          signature,
          razorpayPayment,
          additionalData
        },
        webhookReceived: false
      },
      { new: true }
    ).populate('companyId');

    if (!paymentLog) {
      logger.error('Payment log not found for order:', orderId);
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update company payment status
    const company = await Company.findByIdAndUpdate(
      paymentLog.companyId._id,
      { 
        paymentStatus: 'completed',
        paymentAmount: paymentLog.amount
      },
      { new: true }
    );

    if (!company) {
      logger.error('Company not found for payment:', paymentLog.companyId._id);
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    logger.info('Payment verified successfully', {
      companyId: company._id,
      companyName: company.name,
      paymentId,
      orderId,
      amount: paymentLog.amount,
      paymentMethod: paymentLog.paymentMethod
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: paymentId,
        orderId: orderId,
        companyId: company._id,
        companyName: company.name,
        amount: paymentLog.amount,
        currency: paymentLog.currency,
        paymentMethod: paymentLog.paymentMethod,
        paidAt: paymentLog.paidAt,
        status: 'paid'
      }
    });

  } catch (error) {
    logger.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentLog = await PaymentLog.findOne({ 
      $or: [
        { paymentId },
        { gatewayOrderId: paymentId }
      ]
    }).populate('companyId', 'name status paymentStatus');

    if (!paymentLog) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: paymentLog.paymentId,
        orderId: paymentLog.gatewayOrderId,
        status: paymentLog.status,
        amount: paymentLog.amount,
        currency: paymentLog.currency,
        paymentMethod: paymentLog.paymentMethod,
        paidAt: paymentLog.paidAt,
        failureReason: paymentLog.failureReason,
        company: paymentLog.companyId,
        createdAt: paymentLog.createdAt,
        formattedAmount: paymentLog.formattedAmount
      }
    });

  } catch (error) {
    logger.error('Error in getPaymentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Handle Razorpay webhooks
const handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature if secret is provided
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(webhookBody)
        .digest('hex');

      if (webhookSignature !== expectedSignature) {
        logger.warn('Invalid webhook signature', {
          provided: webhookSignature,
          expected: expectedSignature
        });
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }
    }

    const { event, payload } = req.body;
    const paymentEntity = payload.payment?.entity || payload.order?.entity;

    logger.info('Webhook received', {
      event,
      entityId: paymentEntity?.id,
      status: paymentEntity?.status
    });

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(paymentEntity);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(paymentEntity);
        break;
        
      case 'order.paid':
        await handleOrderPaid(paymentEntity);
        break;
        
      case 'payment.dispute.created':
        await handlePaymentDispute(paymentEntity);
        break;
        
      default:
        logger.info('Unhandled webhook event', { event });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    logger.error('Webhook handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
};

// Handle payment captured webhook
const handlePaymentCaptured = async (paymentData) => {
  try {
    const paymentLog = await PaymentLog.findOne({
      $or: [
        { paymentId: paymentData.id },
        { gatewayOrderId: paymentData.order_id }
      ]
    });

    if (paymentLog) {
      paymentLog.webhookReceived = true;
      paymentLog.webhookReceivedAt = new Date();
      paymentLog.webhookData = paymentData;
      
      if (paymentLog.status !== 'paid') {
        await paymentLog.markAsPaid(paymentData);
        
        // Update company status
        await Company.findByIdAndUpdate(paymentLog.companyId, {
          paymentStatus: 'completed'
        });
      }
      
      await paymentLog.save();
      logger.info('Payment captured via webhook', { paymentId: paymentData.id });
    }
  } catch (error) {
    logger.error('Error handling payment captured webhook:', error);
  }
};

// Handle payment failed webhook
const handlePaymentFailed = async (paymentData) => {
  try {
    const paymentLog = await PaymentLog.findOne({
      $or: [
        { paymentId: paymentData.id },
        { gatewayOrderId: paymentData.order_id }
      ]
    });

    if (paymentLog && paymentLog.status !== 'failed') {
      await paymentLog.markAsFailed(
        paymentData.error_description || 'Payment failed',
        paymentData.error_code
      );
      
      paymentLog.webhookReceived = true;
      paymentLog.webhookReceivedAt = new Date();
      paymentLog.webhookData = paymentData;
      await paymentLog.save();
      
      logger.info('Payment failed via webhook', { 
        paymentId: paymentData.id,
        reason: paymentData.error_description 
      });
    }
  } catch (error) {
    logger.error('Error handling payment failed webhook:', error);
  }
};

// Handle order paid webhook
const handleOrderPaid = async (orderData) => {
  try {
    const paymentLog = await PaymentLog.findOne({
      gatewayOrderId: orderData.id
    });

    if (paymentLog) {
      paymentLog.webhookReceived = true;
      paymentLog.webhookReceivedAt = new Date();
      paymentLog.webhookData = orderData;
      await paymentLog.save();
      
      logger.info('Order paid webhook received', { orderId: orderData.id });
    }
  } catch (error) {
    logger.error('Error handling order paid webhook:', error);
  }
};

// Handle payment dispute webhook
const handlePaymentDispute = async (disputeData) => {
  try {
    const paymentLog = await PaymentLog.findOne({
      paymentId: disputeData.payment_id
    });

    if (paymentLog) {
      paymentLog.status = 'disputed';
      paymentLog.webhookReceived = true;
      paymentLog.webhookReceivedAt = new Date();
      paymentLog.webhookData = disputeData;
      
      await paymentLog.addInternalNote(
        `Payment disputed: ${disputeData.reason_description}`,
        null // System generated note
      );
      
      await paymentLog.save();
      
      logger.warn('Payment dispute created', { 
        paymentId: disputeData.payment_id,
        reason: disputeData.reason_description 
      });
    }
  } catch (error) {
    logger.error('Error handling payment dispute webhook:', error);
  }
};

// Get payment analytics
const getPaymentAnalytics = async (req, res) => {
  try {
    const { 
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate = new Date(),
      groupBy = 'day'
    } = req.query;

    const matchStage = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    // Revenue analytics
    const revenueData = await PaymentLog.getRevenueByPeriod(
      new Date(startDate),
      new Date(endDate)
    );

    // Payment method breakdown
    const paymentMethodStats = await PaymentLog.aggregate([
      { $match: { ...matchStage, status: 'paid' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Status breakdown
    const statusStats = await PaymentLog.getPaymentStats();

    // Failure analysis
    const failureReasons = await PaymentLog.aggregate([
      { $match: { ...matchStage, status: 'failed' } },
      {
        $group: {
          _id: '$failureReason',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueData,
        paymentMethodStats,
        statusStats,
        failureReasons,
        dateRange: {
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    logger.error('Error in getPaymentAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Initiate refund
const initiateRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const paymentLog = await PaymentLog.findOne({ paymentId });
    
    if (!paymentLog) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (paymentLog.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid payments can be refunded'
      });
    }

    const refundAmount = amount || paymentLog.amount;
    
    if (refundAmount > paymentLog.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed payment amount'
      });
    }

    // Create refund with Razorpay
    const refund = await razorpay.payments.refund(paymentId, {
      amount: refundAmount,
      notes: {
        reason: reason || 'Admin initiated refund',
        refundedBy: req.admin?.username || 'system'
      }
    });

    // Update payment log
    await paymentLog.markAsRefunded(refund.id);
    await paymentLog.initiateRefund(refundAmount, reason);

    logger.info('Refund initiated', {
      paymentId,
      refundId: refund.id,
      amount: refundAmount,
      reason
    });

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        paymentId,
        amount: refundAmount,
        status: refund.status
      }
    });

  } catch (error) {
    logger.error('Error initiating refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating refund',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  handleWebhook,
  getPaymentAnalytics,
  initiateRefund
};