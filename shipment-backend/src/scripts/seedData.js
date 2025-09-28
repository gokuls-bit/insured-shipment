// scripts/seedData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const Admin = require('../src/models/Admin');
const Company = require('../src/models/Company');
const PaymentLog = require('../src/models/PaymentLog');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/surakshitsafar', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample admin data
const adminData = [
  {
    username: 'admin',
    email: 'admin@surakshitsafar.com',
    password: 'AdminPass123!',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'super_admin',
    isActive: true,
    isEmailVerified: true
  },
  {
    username: 'moderator',
    email: 'moderator@surakshitsafar.com',
    password: 'ModeratorPass123!',
    firstName: 'Content',
    lastName: 'Moderator',
    role: 'moderator',
    isActive: true,
    isEmailVerified: true
  }
];

// Sample company data
const companyData = [
  {
    name: "Global Marine Insurance Co.",
    email: "contact@globalmarineins.com",
    website: "https://globalmarineins.com",
    contact: "+65-6234-5678",
    routes: ["Singapore-Mumbai", "Singapore-Chennai", "Singapore-Dubai"],
    cargoTypes: ["Electronics", "Machinery", "Automotive"],
    shipmentTypes: ["Ship", "Air"],
    coverage: "International",
    maxCoverage: { amount: 5000000, currency: "USD" },
    established: 2005,
    rating: 4.8,
    claimSettlementRate: "96%",
    status: "approved",
    verified: true,
    paymentStatus: "completed",
    submittedBy: {
      name: "John Lim",
      email: "john.lim@globalmarineins.com",
      phone: "+65-6234-5678",
      designation: "Business Development Manager"
    },
    description: "Leading marine insurance provider in Southeast Asia with comprehensive coverage for international shipments.",
    licenseNumber: "SGP-MAR-2005-001"
  },
  {
    name: "EuroTrans Cargo Shield",
    email: "info@eurotrans-cargo.de",
    website: "https://eurotrans-cargo.de",
    contact: "+49-30-1234-5678",
    routes: ["Hamburg-Mumbai", "Rotterdam-Chennai", "Frankfurt-Delhi"],
    cargoTypes: ["Electronics", "Pharmaceuticals", "Textiles"],
    shipmentTypes: ["Road", "Rail", "Air"],
    coverage: "Europe-Asia",
    maxCoverage: { amount: 8000000, currency: "EUR" },
    established: 1995,
    rating: 4.7,
    claimSettlementRate: "94%",
    status: "approved",
    verified: true,
    paymentStatus: "completed",
    submittedBy: {
      name: "Klaus Mueller",
      email: "k.mueller@eurotrans-cargo.de",
      phone: "+49-30-1234-5678",
      designation: "Regional Director"
    },
    description: "Premier European cargo insurance specialist with extensive experience in Euro-Asian trade routes.",
    licenseNumber: "DE-CARGO-1995-042"
  },
  {
    name: "Pacific Freight Insurance",
    email: "admin@pacificfreight.au",
    website: "https://pacificfreight.au",
    contact: "+61-2-9876-5432",
    routes: ["Sydney-Tokyo", "Melbourne-Seoul", "Brisbane-Shanghai"],
    cargoTypes: ["Mining Equipment", "Agricultural Products", "Electronics"],
    shipmentTypes: ["Ship", "Air"],
    coverage: "Pacific Region",
    maxCoverage: { amount: 6000000, currency: "AUD" },
    established: 2008,
    rating: 4.5,
    claimSettlementRate: "92%",
    status: "approved",
    verified: true,
    paymentStatus: "completed",
    submittedBy: {
      name: "Sarah Wilson",
      email: "s.wilson@pacificfreight.au",
      phone: "+61-2-9876-5432",
      designation: "Operations Manager"
    },
    description: "Australia's trusted partner for Pacific Rim cargo insurance with specialized mining equipment coverage.",
    licenseNumber: "AU-PAC-2008-156"
  },
  {
    name: "TransAtlantic Cargo Care",
    email: "contact@transatlantic.com",
    website: "https://transatlantic.com",
    contact: "+1-555-0199",
    routes: ["New York-London", "Los Angeles-Hamburg", "Miami-Barcelona"],
    cargoTypes: ["Oil & Gas", "Automotive", "Consumer Goods"],
    shipmentTypes: ["Ship", "Air", "Road"],
    coverage: "Global",
    maxCoverage: { amount: 10000000, currency: "USD" },
    established: 2001,
    rating: 4.6,
    claimSettlementRate: "95%",
    status: "approved",
    verified: true,
    paymentStatus: "completed",
    submittedBy: {
      name: "Robert Johnson",
      email: "r.johnson@transatlantic.com",
      phone: "+1-555-0199",
      designation: "VP Business Development"
    },
    description: "Global leader in transatlantic cargo insurance with specialized oil & gas coverage.",
    licenseNumber: "US-TRANS-2001-789"
  },
  {
    name: "Silk Road Insurance Group",
    email: "service@silkroadins.com",
    website: "https://silkroadins.com",
    contact: "+86-21-6234-5678",
    routes: ["Shanghai-Hamburg", "Beijing-London", "Guangzhou-Rotterdam"],
    cargoTypes: ["Electronics", "Textiles", "Machinery", "Consumer Goods"],
    shipmentTypes: ["Rail", "Road", "Ship"],
    coverage: "China-Europe",
    maxCoverage: { amount: 7000000, currency: "USD" },
    established: 2010,
    rating: 4.4,
    claimSettlementRate: "90%",
    status: "pending",
    verified: false,
    paymentStatus: "completed",
    submittedBy: {
      name: "Li Wei",
      email: "l.wei@silkroadins.com",
      phone: "+86-21-6234-5678",
      designation: "International Business Director"
    },
    description: "Specialized in Belt and Road Initiative cargo insurance with extensive rail network coverage.",
    licenseNumber: "CN-SILK-2010-234"
  }
];

// Seed functions
const seedAdmins = async () => {
  try {
    await Admin.deleteMany({});
    console.log('Existing admin data cleared');
    
    for (const admin of adminData) {
      const newAdmin = new Admin(admin);
      await newAdmin.save();
      console.log(`Admin created: ${admin.username} (${admin.role})`);
    }
    
    console.log('Admin seeding completed');
  } catch (error) {
    console.error('Error seeding admins:', error);
  }
};

const seedCompanies = async () => {
  try {
    await Company.deleteMany({});
    console.log('Existing company data cleared');
    
    const admin = await Admin.findOne({ role: 'super_admin' });
    
    for (const company of companyData) {
      if (company.status === 'approved') {
        company.approvedBy = admin._id;
        company.approvedAt = new Date();
      }
      
      const newCompany = new Company(company);
      await newCompany.save();
      console.log(`Company created: ${company.name} (${company.status})`);
    }
    
    console.log('Company seeding completed');
  } catch (error) {
    console.error('Error seeding companies:', error);
  }
};

const seedPaymentLogs = async () => {
  try {
    await PaymentLog.deleteMany({});
    console.log('Existing payment data cleared');
    
    const companies = await Company.find({ paymentStatus: 'completed' });
    
    for (const company of companies) {
      const paymentLog = new PaymentLog({
        companyId: company._id,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewayOrderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: 1500000, // ₹15,000 in paisa
        currency: 'INR',
        status: 'paid',
        paymentMethod: ['card', 'upi', 'netbanking'][Math.floor(Math.random() * 3)],
        paidAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        customerInfo: {
          email: company.submittedBy.email,
          phone: company.submittedBy.phone,
          name: company.submittedBy.name
        },
        settled: true,
        settledAt: new Date(),
        reconciled: true,
        reconciledAt: new Date()
      });
      
      await paymentLog.save();
      console.log(`Payment log created for: ${company.name}`);
    }
    
    console.log('Payment logs seeding completed');
  } catch (error) {
    console.error('Error seeding payment logs:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');
  console.log('==========================================');
  
  try {
    await connectDB();
    
    // Seed in order
    await seedAdmins();
    console.log('');
    
    await seedCompanies();
    console.log('');
    
    await seedPaymentLogs();
    console.log('');
    
    console.log('==========================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('Default Admin Credentials:');
    console.log('Username: admin');
    console.log('Password: AdminPass123!');
    console.log('');
    console.log('Moderator Credentials:');
    console.log('Username: moderator');
    console.log('Password: ModeratorPass123!');
    console.log('');
    console.log('⚠️  IMPORTANT: Change default passwords in production!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--clear')) {
  // Clear all data
  const clearDatabase = async () => {
    try {
      await connectDB();
      await Admin.deleteMany({});
      await Company.deleteMany({});
      await PaymentLog.deleteMany({});
      console.log('✅ Database cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing database:', error);
    } finally {
      await mongoose.connection.close();
      process.exit(0);
    }
  };
  clearDatabase();
} else if (args.includes('--admins-only')) {
  // Seed only admins
  const seedAdminsOnly = async () => {
    try {
      await connectDB();
      await seedAdmins();
      console.log('✅ Admin seeding completed');
    } catch (error) {
      console.error('❌ Admin seeding failed:', error);
    } finally {
      await mongoose.connection.close();
      process.exit(0);
    }
  };
  seedAdminsOnly();
} else if (args.includes('--companies-only')) {
  // Seed only companies
  const seedCompaniesOnly = async () => {
    try {
      await connectDB();
      await seedCompanies();
      console.log('✅ Company seeding completed');
    } catch (error) {
      console.error('❌ Company seeding failed:', error);
    } finally {
      await mongoose.connection.close();
      process.exit(0);
    }
  };
  seedCompaniesOnly();
} else {
  // Run full seeding
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedAdmins,
  seedCompanies,
  seedPaymentLogs
};