// src/controllers/companyController.js - Company Management Controller
const Company = require('../models/Company');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHandler');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Create new company
// @route   POST /api/v1/companies
// @access  Public
const createCompany = asyncHandler(async (req, res) => {
  const {
    name, email, website, contact, description, established, coverage,
    maxCoverageAmount, maxCoverageCurrency, routes, cargoTypes, shipmentTypes,
    submitterName, submitterEmail, submitterPhone, submitterDesignation
  } = req.body;

  // Validation
  if (!name || !email || !website || !contact || !maxCoverageAmount || !submitterName || !submitterEmail || !submitterPhone) {
    return errorResponse(res, 'Please provide all required fields', 400);
  }

  // Check if company exists
  const companyExists = await Company.findOne({ $or: [{ name }, { email }] });
  if (companyExists) {
    return errorResponse(res, 'Company already exists with this name or email', 400);
  }

  // Create company
  const company = await Company.create({
    name, email, website, contact, description, established, coverage,
    maxCoverageAmount, maxCoverageCurrency: maxCoverageCurrency || 'USD',
    routes: routes || [], cargoTypes: cargoTypes || [], shipmentTypes: shipmentTypes || [],
    status: 'pending',
    paymentStatus: 'completed',
    submittedBy: {
      name: submitterName,
      email: submitterEmail,
      phone: submitterPhone,
      designation: submitterDesignation || ''
    }
  });

  // Invalidate cache
  await cacheDelPattern('companies:*');

  logger.info(`New company created: ${company.name} (ID: ${company._id})`);

  successResponse(res, company, 'Company submitted successfully', 201);
});

// @desc    Get all companies with filters
// @route   GET /api/v1/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const {
    status, paymentStatus, shipmentType, cargoType, route, search,
    page = 1, limit = 10, sort = '-createdAt'
  } = req.query;

  // Build cache key
  const cacheKey = `companies:${JSON.stringify(req.query)}`;
  
  // Check cache
  const cachedData = await cacheGet(cacheKey);
  if (cachedData) {
    logger.info('Returning cached companies data');
    return res.status(200).json(cachedData);
  }

  // Build query
  const query = {};

  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (shipmentType) query.shipmentTypes = shipmentType;
  if (cargoType) query.cargoTypes = cargoType;
  if (route) query.routes = { $regex: route, $options: 'i' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const companies = await Company.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  // Get total count
  const count = await Company.countDocuments(query);

  const response = {
    success: true,
    message: 'Companies retrieved successfully',
    data: companies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  };

  // Cache the result
  await cacheSet(cacheKey, response, 600); // 10 minutes

  res.status(200).json(response);
});

// @desc    Get company by ID
// @route   GET /api/v1/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  // Increment views
  await company.incrementViews();

  successResponse(res, company, 'Company retrieved successfully');
});

// @desc    Update company
// @route   PUT /api/v1/companies/:id
// @access  Private (Admin/Moderator)
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  // Update fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      company[key] = req.body[key];
    }
  });

  await company.save();

  // Invalidate cache
  await cacheDelPattern('companies:*');

  logger.info(`Company updated: ${company.name} by ${req.user.username}`);

  successResponse(res, company, 'Company updated successfully');
});

// @desc    Approve company
// @route   PUT /api/v1/companies/:id/approve
// @access  Private (Admin/Moderator)
const approveCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  company.status = 'approved';
  company.verified = true;
  company.approvedBy = req.user._id;
  company.approvedAt = new Date();

  await company.save();

  // Invalidate cache
  await cacheDelPattern('companies:*');

  logger.info(`Company approved: ${company.name} by ${req.user.username}`);

  successResponse(res, company, 'Company approved successfully');
});

// @desc    Reject company
// @route   PUT /api/v1/companies/:id/reject
// @access  Private (Admin/Moderator)
const rejectCompany = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  const company = await Company.findById(req.params.id);

  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  company.status = 'rejected';
  company.rejectedBy = req.user._id;
  company.rejectedAt = new Date();
  company.rejectionReason = rejectionReason || '';

  await company.save();

  // Invalidate cache
  await cacheDelPattern('companies:*');

  logger.info(`Company rejected: ${company.name} by ${req.user.username}`);

  successResponse(res, company, 'Company rejected successfully');
});

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private (Admin)
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  await company.deleteOne();

  // Invalidate cache
  await cacheDelPattern('companies:*');

  logger.info(`Company deleted: ${company.name} by ${req.user.username}`);

  successResponse(res, null, 'Company deleted successfully');
});

// @desc    Track company click
// @route   POST /api/v1/companies/:id/click
// @access  Public
const trackClick = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return errorResponse(res, 'Company not found', 404);
  }

  await company.incrementClicks();

  successResponse(res, { clicks: company.clicks }, 'Click tracked');
});

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  approveCompany,
  rejectCompany,
  deleteCompany,
  trackClick
};