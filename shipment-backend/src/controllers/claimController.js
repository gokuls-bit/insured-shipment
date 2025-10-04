// src/controllers/claimController.js - Claims Management Controller
const { Claim, Policy } = require('../models/Policy');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHandler');
const { sendEmail, emailTemplates } = require('../utils/emailSender');
const logger = require('../utils/logger');

// @desc    Submit new claim
// @route   POST /api/v1/claims
// @access  Private
const submitClaim = asyncHandler(async (req, res) => {
  const { policyId, description, claimAmount, currency } = req.body;

  // Validation
  if (!policyId || !description || !claimAmount) {
    return errorResponse(res, 'Please provide all required fields', 400);
  }

  // Verify policy exists and belongs to user
  const policy = await Policy.findById(policyId).populate('companyId');
  if (!policy) {
    return errorResponse(res, 'Policy not found', 404);
  }

  if (policy.userId.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Unauthorized to file claim on this policy', 403);
  }

  // Check if policy is active
  if (policy.status !== 'active') {
    return errorResponse(res, 'Policy is not active', 400);
  }

  // Check if claim amount exceeds coverage
  if (claimAmount > policy.coverageAmount) {
    return errorResponse(res, 'Claim amount exceeds policy coverage', 400);
  }

  // Create claim
  const claim = await Claim.create({
    policyId,
    filedBy: req.user._id,
    description,
    claimAmount,
    currency: currency || policy.currency,
    status: 'submitted'
  });

  // Add audit entry
  await claim.addAudit('Claim submitted', req.user._id, 'Initial claim submission');

  // Send email notification
  await sendEmail(
    req.user.email,
    'Claim Submitted Successfully',
    emailTemplates.claimFiled(
      claim.claimNumber,
      policy.policyNumber,
      `${claim.claimAmount} ${claim.currency}`
    )
  );

  logger.info(`Claim submitted: ${claim.claimNumber} by user ${req.user._id}`);

  successResponse(res, claim, 'Claim submitted — see you in future', 201);
});

// @desc    Get all claims
// @route   GET /api/v1/claims
// @access  Private
const getClaims = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const query = {};

  // Non-admin users can only see their own claims
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    query.filedBy = req.user._id;
  }

  if (status) query.status = status;

  const claims = await Claim.find(query)
    .populate('policyId')
    .populate('filedBy', 'username email')
    .populate('reviewedBy', 'username email')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Claim.countDocuments(query);

  paginatedResponse(res, claims, page, limit, count, 'Claims retrieved successfully');
});

// @desc    Get claim by ID
// @route   GET /api/v1/claims/:id
// @access  Private
const getClaimById = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('policyId')
    .populate('filedBy', 'username email')
    .populate('reviewedBy', 'username email')
    .populate('audit.performedBy', 'username');

  if (!claim) {
    return errorResponse(res, 'Claim not found', 404);
  }

  // Check authorization
  if (req.user.role !== 'admin' && req.user.role !== 'moderator' && 
      claim.filedBy._id.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Unauthorized to view this claim', 403);
  }

  successResponse(res, claim, 'Claim retrieved successfully');
});

// @desc    Review claim
// @route   PUT /api/v1/claims/:id/review
// @access  Private (Admin/Moderator)
const reviewClaim = asyncHandler(async (req, res) => {
  const { status, resolutionNotes, paidAmount } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return errorResponse(res, 'Valid status (approved/rejected) is required', 400);
  }

  const claim = await Claim.findById(req.params.id)
    .populate('policyId')
    .populate('filedBy', 'username email');

  if (!claim) {
    return errorResponse(res, 'Claim not found', 404);
  }

  if (claim.status !== 'submitted' && claim.status !== 'under_review') {
    return errorResponse(res, 'Claim has already been reviewed', 400);
  }

  claim.status = status;
  claim.resolutionNotes = resolutionNotes || '';
  claim.reviewedBy = req.user._id;
  claim.reviewedAt = new Date();

  if (status === 'approved' && paidAmount) {
    claim.paidAmount = paidAmount;
    claim.paidAt = new Date();
    claim.status = 'paid';
  }

  await claim.save();

  // Add audit entry
  await claim.addAudit(
    `Claim ${status}`,
    req.user._id,
    resolutionNotes || `Claim ${status} by ${req.user.username}`
  );

  // Update policy status if claim is approved
  if (status === 'approved') {
    const policy = await Policy.findById(claim.policyId);
    policy.status = 'claimed';
    await policy.save();
  }

  // Send email notification
  await sendEmail(
    claim.filedBy.email,
    `Claim ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    emailTemplates.claimDecision(
      claim.claimNumber,
      status,
      resolutionNotes,
      paidAmount ? `${paidAmount} ${claim.currency}` : null
    )
  );

  logger.info(`Claim ${status}: ${claim.claimNumber} by ${req.user.username}`);

  successResponse(res, claim, `Claim ${status} successfully`);
});

// @desc    Update claim status
// @route   PUT /api/v1/claims/:id/status
// @access  Private (Admin/Moderator)
const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return errorResponse(res, 'Claim not found', 404);
  }

  const oldStatus = claim.status;
  claim.status = status;
  await claim.save();

  // Add audit entry
  await claim.addAudit(
    `Status changed from ${oldStatus} to ${status}`,
    req.user._id,
    notes || ''
  );

  logger.info(`Claim status updated: ${claim.claimNumber} from ${oldStatus} to ${status}`);

  successResponse(res, claim, 'Claim status updated successfully');
});

module.exports = {
  submitClaim,
  getClaims,
  getClaimById,
  reviewClaim,
  updateClaimStatus
};