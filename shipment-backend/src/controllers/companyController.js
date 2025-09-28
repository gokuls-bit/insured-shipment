// src/controllers/companyController.js
const Company = require('../models/Company');
const PaymentLog = require('../models/PaymentLog');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Get companies with advanced filtering
const getCompanies = async (req, res) => {
  try {
    const {
      search,
      departurePort,
      arrivalPort,
      cargoType,
      shipmentType,
      coverage,
      minRating,
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { 
      status: 'approved', 
      paymentStatus: 'completed',
      verified: true 
    };

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { coverage: { $regex: search, $options: 'i' } }
      ];
    }

    // Route-based filtering
    if (departurePort || arrivalPort) {
      const routeConditions = [];
      
      if (departurePort && arrivalPort) {
        // Both departure and arrival specified
        const routePattern = `${departurePort}.*${arrivalPort}`;
        routeConditions.push({ 
          routes: { $regex: routePattern, $options: 'i' } 
        });
      } else if (departurePort) {
        // Only departure specified
        routeConditions.push({ 
          routes: { $regex: `^${departurePort}`, $options: 'i' } 
        });
      } else if (arrivalPort) {
        // Only arrival specified
        routeConditions.push({ 
          routes: { $regex: `${arrivalPort}$`, $options: 'i' } 
        });
      }
      
      if (routeConditions.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ $or: routeConditions });
      }
    }

    // Cargo type filter
    if (cargoType) {
      query.cargoTypes = { $in: [cargoType] };
    }

    // Shipment type filter
    if (shipmentType) {
      query.shipmentTypes = { $in: [shipmentType] };
    }

    // Coverage filter
    if (coverage) {
      query.coverage = coverage;
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Build sort object
    const sortObj = {};
    const validSortFields = ['rating', 'established', 'clickCount', 'createdAt', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
    sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Add secondary sort by createdAt for consistency
    if (sortField !== 'createdAt') {
      sortObj.createdAt = -1;
    }

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortObj,
      populate: [
        {
          path: 'approvedBy',
          select: 'username email',
          model: 'Admin'
        }
      ]
    };

    // Use aggregation for complex queries
    const pipeline = [
      { $match: query },
      { $sort: sortObj },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'admins',
          localField: 'approvedBy',
          foreignField: '_id',
          as: 'approvedBy',
          pipeline: [{ $project: { username: 1, email: 1 } }]
        }
      },
      {
        $unwind: {
          path: '$approvedBy',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    const [companies, totalCount] = await Promise.all([
      Company.aggregate(pipeline),
      Company.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Log search query for analytics
    logger.info('Company search performed', {
      query: req.query,
      resultCount: companies.length,
      totalCount,
      ip: req.ip
    });

    res.status(200).json({
      success: true,
      data: companies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCompanies: totalCount,
        companiesPerPage: parseInt(limit),
        hasNext,
        hasPrev
      },
      filters: {
        search,
        departurePort,
        arrivalPort,
        cargoType,
        shipmentType,
        coverage,
        minRating
      },
      sorting: {
        sortBy: sortField,
        sortOrder
      }
    });

  } catch (error) {
    logger.error('Error in getCompanies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Submit new company for approval
const submitCompany = async (req, res) => {
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
      name,
      email,
      website,
      contact,
      routes,
      cargoTypes,
      shipmentTypes,
      coverage,
      maxCoverage,
      established,
      description,
      licenseNumber,
      headquartersAddress,
      submitterInfo
    } = req.body;

    // Check if company with same name and email already exists
    const existingCompany = await Company.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { email: email.toLowerCase() }
      ]
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: 'A company with this name or email already exists',
        existingCompany: {
          name: existingCompany.name,
          email: existingCompany.email,
          status: existingCompany.status
        }
      });
    }

    // Create new company
    const companyData = {
      name: name.trim(),
      email: email.toLowerCase(),
      website,
      contact,
      routes: routes || [],
      cargoTypes: cargoTypes || [],
      shipmentTypes,
      coverage: coverage || 'Regional',
      established,
      description: description?.trim(),
      submittedBy: {
        name: submitterInfo.name,
        email: submitterInfo.email.toLowerCase(),
        phone: submitterInfo.phone,
        designation: submitterInfo.designation || ''
      },
      status: 'pending',
      paymentStatus: 'pending'
    };

    // Add optional fields if provided
    if (maxCoverage) {
      companyData.maxCoverage = maxCoverage;
    }
    if (licenseNumber) {
      companyData.licenseNumber = licenseNumber;
    }
    if (headquartersAddress) {
      companyData.headquartersAddress = headquartersAddress;
    }

    const company = new Company(companyData);
    const savedCompany = await company.save();

    logger.info('New company submitted', {
      companyId: savedCompany._id,
      name: savedCompany.name,
      submitterEmail: savedCompany.submittedBy.email
    });

    res.status(201).json({
      success: true,
      message: 'Company submitted successfully. Please proceed with payment to complete the listing process.',
      data: {
        companyId: savedCompany._id,
        name: savedCompany.name,
        email: savedCompany.email,
        status: savedCompany.status,
        paymentRequired: true,
        paymentAmount: savedCompany.paymentAmount,
        submittedAt: savedCompany.submittedAt
      }
    });

  } catch (error) {
    logger.error('Error in submitCompany:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Company with this information already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting company',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Track company click/view for analytics
const trackCompanyClick = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { action = 'click' } = req.body;

    if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update analytics based on action
    let updateOperation = {};
    switch (action) {
      case 'click':
        updateOperation = { $inc: { clickCount: 1 } };
        break;
      case 'view':
        updateOperation = { $inc: { viewCount: 1 } };
        break;
      case 'quote':
        updateOperation = { $inc: { quoteRequests: 1 } };
        break;
      default:
        updateOperation = { $inc: { clickCount: 1 } };
    }

    await Company.findByIdAndUpdate(companyId, updateOperation);

    logger.info('Company interaction tracked', {
      companyId,
      companyName: company.name,
      action,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(200).json({
      success: true,
      message: `${action} tracked successfully`,
      data: {
        companyId,
        action,
        timestamp: new Date()
      }
    });

  } catch (error) {
    logger.error('Error in trackCompanyClick:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking company interaction',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get available filter options
const getFilterOptions = async (req, res) => {
  try {
    const [
      availableRoutes,
      availableCargoTypes,
      availableShipmentTypes,
      coverageTypes
    ] = await Promise.all([
      Company.distinct('routes', { status: 'approved', verified: true }),
      Company.distinct('cargoTypes', { status: 'approved', verified: true }),
      Company.distinct('shipmentTypes', { status: 'approved', verified: true }),
      Company.distinct('coverage', { status: 'approved', verified: true })
    ]);

    // Extract unique departure and arrival ports from routes
    const departurePorts = new Set();
    const arrivalPorts = new Set();
    
    availableRoutes.forEach(route => {
      const [departure, arrival] = route.split('-');
      if (departure?.trim()) departurePorts.add(departure.trim());
      if (arrival?.trim()) arrivalPorts.add(arrival.trim());
    });

    res.status(200).json({
      success: true,
      data: {
        routes: availableRoutes.sort(),
        departurePorts: Array.from(departurePorts).sort(),
        arrivalPorts: Array.from(arrivalPorts).sort(),
        cargoTypes: availableCargoTypes.sort(),
        shipmentTypes: availableShipmentTypes.sort(),
        coverageTypes: coverageTypes.sort(),
        ratingRange: {
          min: 0,
          max: 5,
          step: 0.1
        }
      }
    });

  } catch (error) {
    logger.error('Error in getFilterOptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get company statistics
const getCompanyStats = async (req, res) => {
  try {
    const stats = await Company.aggregate([
      {
        $facet: {
          statusStats: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          verificationStats: [
            {
              $group: {
                _id: '$verified',
                count: { $sum: 1 }
              }
            }
          ],
          coverageStats: [
            {
              $group: {
                _id: '$coverage',
                count: { $sum: 1 },
                avgRating: { $avg: '$rating' }
              }
            }
          ],
          shipmentTypeStats: [
            { $unwind: '$shipmentTypes' },
            {
              $group: {
                _id: '$shipmentTypes',
                count: { $sum: 1 }
              }
            }
          ],
          totalStats: [
            {
              $group: {
                _id: null,
                totalCompanies: { $sum: 1 },
                totalClicks: { $sum: '$clickCount' },
                totalViews: { $sum: '$viewCount' },
                avgRating: { $avg: '$rating' },
                totalQuoteRequests: { $sum: '$quoteRequests' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    logger.error('Error in getCompanyStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get company by ID with full details
const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid company ID format'
      });
    }

    const company = await Company.findById(companyId)
      .populate('approvedBy', 'username email')
      .lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Only return approved companies to public
    if (company.status !== 'approved' || !company.verified) {
      return res.status(404).json({
        success: false,
        message: 'Company not found or not yet approved'
      });
    }

    // Increment view count
    await Company.findByIdAndUpdate(companyId, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      data: company
    });

  } catch (error) {
    logger.error('Error in getCompanyById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getCompanies,
  submitCompany,
  trackCompanyClick,
  getFilterOptions,
  getCompanyStats,
  getCompanyById
};