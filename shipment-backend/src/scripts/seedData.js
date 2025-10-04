// src/scripts/seed.js - Database Seed Script
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Shipment = require('../models/Shipment');
const { Policy } = require('../models/Policy');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Shipment.deleteMany({});
    await Policy.deleteMany({});

    // Create Admin User
    console.log('Creating admin user...');
    const admin = await User.create({
      username: 'admin',
      email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@shipment.com',
      passwordHash: process.env.ADMIN_DEFAULT_PASS || 'Admin@123',
      role: 'admin',
      isActive: true
    });
    console.log(`Admin created: ${admin.email}`);

    // Create Moderator User
    console.log('Creating moderator user...');
    const moderator = await User.create({
      username: 'moderator',
      email: process.env.MODERATOR_DEFAULT_EMAIL || 'mod@shipment.com',
      passwordHash: process.env.MODERATOR_DEFAULT_PASS || 'Mod@123',
      role: 'moderator',
      isActive: true
    });
    console.log(`Moderator created: ${moderator.email}`);

    // Create Demo User
    console.log('Creating demo user...');
    const demoUser = await User.create({
      username: 'demouser',
      email: 'demo@example.com',
      passwordHash: 'Demo@123',
      role: 'user',
      isActive: true
    });
    console.log(`Demo user created: ${demoUser.email}`);

    // Create Demo Companies
    console.log('Creating demo companies...');
    
    const company1 = await Company.create({
      name: 'SecureCargo Insurance Ltd.',
      email: 'contact@securecargo.com',
      website: 'https://www.securecargo.com',
      contact: '+91-555-1234',
      description: 'Industry-leading comprehensive coverage with 24/7 claims support',
      established: 1995,
      coverage: 'Global',
      maxCoverageAmount: 50,
      maxCoverageCurrency: 'USD',
      routes: ['Mumbai (JNPT) - Singapore Port', 'Chennai - Dubai'],
      cargoTypes: ['Electronics', 'Machinery', 'Pharmaceuticals'],
      shipmentTypes: ['Ship', 'Air'],
      status: 'approved',
      paymentStatus: 'completed',
      verified: true,
      rating: 4.9,
      claimSettlement: '98%',
      pricing: '₹2,50,000 - ₹5,00,000',
      serviceTier: 'Premium Plus',
      clicks: 150,
      views: 450,
      quotes: 75,
      submittedBy: {
        name: 'John Doe',
        email: 'john@securecargo.com',
        phone: '+91-555-1234',
        designation: 'Business Manager'
      },
      approvedBy: admin._id,
      approvedAt: new Date()
    });

    const company2 = await Company.create({
      name: 'Global Shield Maritime',
      email: 'info@globalshield.com',
      website: 'https://www.globalshield.com',
      contact: '+91-555-2345',
      description: 'Trusted maritime insurance provider with extensive network coverage',
      established: 2001,
      coverage: 'Worldwide',
      maxCoverageAmount: 35,
      maxCoverageCurrency: 'USD',
      routes: ['Mumbai (JNPT) - New York', 'Kolkata - Hamburg'],
      cargoTypes: ['Textiles', 'Automotive', 'Food Products'],
      shipmentTypes: ['Ship', 'Rail'],
      status: 'approved',
      paymentStatus: 'completed',
      verified: true,
      rating: 4.7,
      claimSettlement: '95%',
      pricing: '₹2,00,000 - ₹4,50,000',
      serviceTier: 'Premium',
      clicks: 120,
      views: 380,
      quotes: 60,
      submittedBy: {
        name: 'Jane Smith',
        email: 'jane@globalshield.com',
        phone: '+91-555-2345',
        designation: 'Sales Director'
      },
      approvedBy: admin._id,
      approvedAt: new Date()
    });

    const company3 = await Company.create({
      name: 'TransitGuard Solutions',
      email: 'support@transitguard.com',
      website: 'https://www.transitguard.com',
      contact: '+91-555-3456',
      description: 'Regional specialist with competitive rates and fast claim processing',
      established: 2008,
      coverage: 'Asia-Pacific',
      maxCoverageAmount: 25,
      maxCoverageCurrency: 'USD',
      routes: ['Mumbai (JNPT) - Singapore Port', 'Chennai - Bangkok'],
      cargoTypes: ['Electronics', 'Consumer Goods', 'Chemicals'],
      shipmentTypes: ['Ship', 'Air', 'Road'],
      status: 'pending',
      paymentStatus: 'completed',
      verified: false,
      rating: 0,
      claimSettlement: 'N/A',
      pricing: 'Pending Review',
      serviceTier: 'Standard',
      clicks: 0,
      views: 0,
      quotes: 0,
      submittedBy: {
        name: 'Mike Johnson',
        email: 'mike@transitguard.com',
        phone: '+91-555-3456',
        designation: 'CEO'
      }
    });

    console.log(`Company 1 created: ${company1.name}`);
    console.log(`Company 2 created: ${company2.name}`);
    console.log(`Company 3 created: ${company3.name}`);

    // Create Demo Shipment
    console.log('Creating demo shipment...');
    const shipment = await Shipment.create({
      type: 'Ship',
      origin: {
        country: 'India',
        port: 'Mumbai (JNPT)'
      },
      destination: {
        country: 'Singapore',
        port: 'Singapore Port'
      },
      companyId: company1._id,
      cargoType: 'Electronics',
      cargoDescription: 'Consumer electronics and components',
      insuredAmount: 500000,
      currency: 'USD',
      status: 'in-transit',
      createdBy: demoUser._id,
      departureDate: new Date('2025-10-05'),
      arrivalDate: new Date('2025-10-15')
    });
    console.log(`Shipment created: ${shipment.trackingNumber}`);

    // Create Demo Policy
    console.log('Creating demo policy...');
    const policy = await Policy.create({
      shipmentId: shipment._id,
      userId: demoUser._id,
      companyId: company1._id,
      coverageAmount: 500000,
      premium: 15000,
      currency: 'USD',
      startDate: new Date('2025-10-05'),
      endDate: new Date('2025-10-15'),
      status: 'active',
      coverageType: 'comprehensive'
    });
    console.log(`Policy created: ${policy.policyNumber}`);

    console.log('\n=================================');
    console.log('Database seeded successfully!');
    console.log('=================================\n');
    console.log('Default Users:');
    console.log(`Admin: ${admin.email} / ${process.env.ADMIN_DEFAULT_PASS || 'Admin@123'}`);
    console.log(`Moderator: ${moderator.email} / ${process.env.MODERATOR_DEFAULT_PASS || 'Mod@123'}`);
    console.log(`Demo User: ${demoUser.email} / Demo@123`);
    console.log('\nDemo Data:');
    console.log(`- ${3} Companies`);
    console.log(`- ${1} Shipment`);
    console.log(`- ${1} Policy`);
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();