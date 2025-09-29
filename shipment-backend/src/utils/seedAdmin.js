// src/utils/seedAdmin.js
const Admin = require('../models/Admin');
const logger = require('./logger');

const seedAdmin = async () => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      // Create default super admin
      const defaultAdmin = new Admin({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'gokul',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'gokul@surakshitsafar.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'santji',
        firstName: 'Gokul',
        lastName: 'Administrator',
        role: 'super_admin',
        isActive: true,
        isEmailVerified: true,
        preferences: {
          theme: 'dark',
          language: 'en',
          emailNotifications: true
        }
      });
      
      await defaultAdmin.save();
      
      logger.info('Default admin created successfully', {
        username: defaultAdmin.username,
        email: defaultAdmin.email,
        role: defaultAdmin.role
      });
      
      console.log('✅ Default admin created successfully');
      console.log(`   Username: ${defaultAdmin.username}`);
      console.log(`   Email: ${defaultAdmin.email}`);
      console.log(`   Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'santji'}`);
      console.log(`   Role: ${defaultAdmin.role}`);
      console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');
      
    } else {
      logger.debug('Admin accounts already exist, skipping seed');
    }
  } catch (error) {
    logger.error('Error seeding admin:', error);
    console.error('❌ Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;