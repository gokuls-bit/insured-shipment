// src/controllers/shipmentController.js - Shipment Management Controller
const Shipment = require('../models/Shipment');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHandler');
const { cacheGet, cacheSet, cacheDelPattern } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Create new shipment
// @route   POST /api/v1/shipments
// @access  Private
const createShipment = asyncHandler(async (req, res) => {
  const shipmentData = {
    ...req.body,
    createdBy: req.user._id
  };

  const shipment = await Shipment.create(shipmentData);
  await cacheDelPattern('shipments:*');

  logger.info(`Shipment created: ${shipment.trackingNumber} by user ${req.user._id}`);

  successResponse(res, shipment, 'Shipment created successfully', 201);
});

// @desc    Get all shipments
// @route   GET /api/v1/shipments
// @access  Private
const getShipments = asyncHandler(async (req, res) => {
  const { status, type, origin, destination, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const cacheKey = `shipments:${JSON.stringify(req.query)}:user:${req.user._id}`;
  const cachedData = await cacheGet(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const query = {};
  
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    query.createdBy = req.user._id;
  }

  if (status) query.status = status;
  if (type) query.type = type;
  if (origin) query['origin.port'] = { $regex: origin, $options: 'i' };
  if (destination) query['destination.port'] = { $regex: destination, $options: 'i' };

  const shipments = await Shipment.find(query)
    .populate('companyId', 'name email')
    .populate('createdBy', 'username email')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Shipment.countDocuments(query);

  const response = {
    success: true,
    message: 'Shipments retrieved successfully',
    data: shipments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  };

  await cacheSet(cacheKey, response, 300);
  res.status(200).json(response);
});

// @desc    Get shipment by ID
// @route   GET /api/v1/shipments/:id
// @access  Private
const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id)
    .populate('companyId')
    .populate('createdBy', 'username email');

  if (!shipment) {
    return errorResponse(res, 'Shipment not found', 404);
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator' && 
      shipment.createdBy._id.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Unauthorized to view this shipment', 403);
  }

  successResponse(res, shipment, 'Shipment retrieved successfully');
});

// @desc    Update shipment
// @route   PUT /api/v1/shipments/:id
// @access  Private
const updateShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    return errorResponse(res, 'Shipment not found', 404);
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator' && 
      shipment.createdBy.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Unauthorized to update this shipment', 403);
  }

  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      shipment[key] = req.body[key];
    }
  });

  await shipment.save();
  await cacheDelPattern('shipments:*');

  successResponse(res, shipment, 'Shipment updated successfully');
});

// @desc    Delete shipment
// @route   DELETE /api/v1/shipments/:id
// @access  Private
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    return errorResponse(res, 'Shipment not found', 404);
  }

  if (req.user.role !== 'admin' && shipment.createdBy.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Unauthorized to delete this shipment', 403);
  }

  await shipment.deleteOne();
  await cacheDelPattern('shipments:*');

  successResponse(res, null, 'Shipment deleted successfully');
});

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment
};

// src/controllers/policyController.js - Policy Management Controller
const { Policy } = require('../models/Policy');
const Shipment = require('../models/Shipment');
const Company = require('../models/Company');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHandler');
const { sendEmail, emailTemplates } = require('../utils/emailSender');
const { cacheGet, cacheSet, cacheDelPattern } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Create new policy
// @route   POST /api/v1/policies
// @access  Private
const createPolicy = asyncHandler(async (req, res) => {
  const { shipmentId, companyId, coverageAmount, premium, startDate, endDate, coverageType } = req.body;

  if (!shipmentId || !companyId || !coverageAmount || !premium || !startDate || !endDate) {
    return errorResponse(res, 'Please provide all required fields', 400);
  }

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    return errorResponse(res, 'Shipment not found', 404);
  }

  const company = await Company.findById(companyId);
  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  if (company.status !== 'approved') {
    return errorResponse(res, 'Company is not approved', 400);
  }

  const policy = await Policy.create({
    shipmentId,
    userId: req.user._id,
    companyId,
    coverageAmount,
    premium,
    startDate,
    endDate,
    coverageType: coverageType || 'basic',
    status: 'active'
  });

  await cacheDelPattern('policies:*');

  await sendEmail(
    req.user.email,
    'Policy Purchased Successfully',
    emailTemplates.policyPurchased(
      policy.policyNumber,
      company.name,
      `${coverageAmount} ${policy.currency}`,
      `${premium} ${policy.currency}`
    )
  );

  logger.info(`Policy created: ${policy.policyNumber} by user ${req.user._id}`);

  successResponse(res, policy, 'Policy created successfully', 201);
});

// @desc    Get all policies
// @route   GET /api/v1/policies
// @access  Private
const getPolicies = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const cacheKey = `policies:${JSON.stringify(req.query)}:user:${req.user._id}`;
  const cachedData = await cacheGet(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const query = {};
  
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    query.userId = req.user._id;
  }

  if (status) query.status = status;

  const policies = await Policy.find(query)
    .populate('shipmentId')
    .populate('userId', 'username email')
    .populate('companyId', 'name email')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Policy.countDocuments(query);

  const response = {
    success: true,
    message: 'Policies retrieved successfully',
    data: policies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  };

  await cacheSet(cacheKey, response, 300);
  res.status(200).json(response);
});

// @desc    Get policy by ID
// @route   GET /api/v1/policies/:id
// @access  Private
const getPolicyById = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id)
    .populate('shipmentId')
    .populate('userId', 'username email')
    .populate('companyId');

  if (!policy) {
    return errorResponse(res, 'Policy not found', 404);
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator' && 
      policy.userId._id.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Unauthorized to view this policy', 403);
  }

  successResponse(res, policy, 'Policy retrieved successfully');
});

// @desc    Update policy
// @route   PUT /api/v1/policies/:id
// @access  Private (Admin/Moderator)
const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (!policy) {
    return errorResponse(res, 'Policy not found', 404);
  }

  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      policy[key] = req.body[key];
    }
  });

  await policy.save();
  await cacheDelPattern('policies:*');

  successResponse(res, policy, 'Policy updated successfully');
});

module.exports = {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy
};