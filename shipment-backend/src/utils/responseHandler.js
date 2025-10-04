// src/utils/responseHandler.js - Standardized API Responses
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};

// src/utils/emailSender.js - Email Notification Service
const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error(`Email transporter error: ${error.message}`);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `SurakshitSafar <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Email send error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  policyPurchased: (policyNumber, companyName, coverageAmount, premium) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Policy Purchased Successfully</h2>
      <p>Dear Customer,</p>
      <p>Your insurance policy has been successfully purchased.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Policy Details</h3>
        <p><strong>Policy Number:</strong> ${policyNumber}</p>
        <p><strong>Insurance Company:</strong> ${companyName}</p>
        <p><strong>Coverage Amount:</strong> ${coverageAmount}</p>
        <p><strong>Premium:</strong> ${premium}</p>
      </div>
      <p>Thank you for choosing SurakshitSafar.</p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
        This is an automated email. Please do not reply.
      </p>
    </div>
  `,

  claimFiled: (claimNumber, policyNumber, claimAmount) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Claim Submitted Successfully</h2>
      <p>Dear Customer,</p>
      <p>Your claim has been submitted and is under review.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Claim Details</h3>
        <p><strong>Claim Number:</strong> ${claimNumber}</p>
        <p><strong>Policy Number:</strong> ${policyNumber}</p>
        <p><strong>Claim Amount:</strong> ${claimAmount}</p>
        <p><strong>Status:</strong> Under Review</p>
      </div>
      <p>We will notify you once your claim has been reviewed.</p>
      <p><strong>Claim submitted — see you in future</strong></p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
        This is an automated email. Please do not reply.
      </p>
    </div>
  `,

  claimDecision: (claimNumber, status, resolutionNotes, paidAmount = null) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${status === 'approved' ? '#10b981' : '#ef4444'};">
        Claim ${status === 'approved' ? 'Approved' : 'Rejected'}
      </h2>
      <p>Dear Customer,</p>
      <p>Your claim has been ${status}.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Decision Details</h3>
        <p><strong>Claim Number:</strong> ${claimNumber}</p>
        <p><strong>Status:</strong> ${status.toUpperCase()}</p>
        ${paidAmount ? `<p><strong>Paid Amount:</strong> ${paidAmount}</p>` : ''}
        ${resolutionNotes ? `<p><strong>Notes:</strong> ${resolutionNotes}</p>` : ''}
      </div>
      <p>Thank you for your patience.</p>
      <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
        This is an automated email. Please do not reply.
      </p>
    </div>
  `
};

module.exports = {
  sendEmail,
  emailTemplates
};