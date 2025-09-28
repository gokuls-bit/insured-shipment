# SurakshitSafar Backend API

A comprehensive MERN stack backend for the SurakshitSafar cargo insurance portal, connecting shipping companies with insurance providers through advanced route-based matching and secure payment processing.

## 🚀 Features

### Core Functionality
- **Advanced Company Search**: Route-based filtering with departure/arrival ports
- **Cargo Type Matching**: Filter companies by specific cargo types they insure
- **Secure Payment Processing**: Razorpay integration with webhook support
- **Admin Dashboard**: Complete company management and analytics system
- **Real-time Analytics**: Track clicks, views, and quote requests

### Security & Performance
- JWT-based authentication with role-based permissions
- Advanced rate limiting with different tiers
- Comprehensive input validation and sanitization
- Production-grade error handling and logging
- MongoDB with optimized indexes and aggregation pipelines

### Business Logic
- Multi-criteria company filtering (routes, cargo types, ratings)
- Payment verification and refund management
- Admin approval workflow for company listings
- Automated email notifications and audit trails

## 📋 Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 5.0
- npm >= 8.0.0
- Razorpay account (for payments)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/surakshitsafar/backend.git
   cd surakshitsafar-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Then seed the database
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Request handlers and business logic
├── middlewares/     # Authentication, validation, error handling
├── models/          # MongoDB schemas and models
├── routes/          # API endpoint definitions
├── utils/           # Utility functions and helpers
└── logs/            # Application logs (auto-generated)
```

## 🔧 Environment Variables

Key environment variables you need to configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/surakshitsafar

# JWT Security
JWT_SECRET=your_32_character_secret_key
JWT_EXPIRE=7d

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
COMPANY_LISTING_FEE=1500000

# Admin Credentials (Change in production!)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=AdminPass123!

# Server Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/companies` - Search companies with advanced filtering
- `POST /api/companies` - Submit new company for listing
- `POST /api/companies/:id/track` - Track company interactions
- `GET /api/companies/filter-options` - Get available filter options

### Payment Endpoints
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment completion
- `GET /api/payments/:id/status` - Check payment status
- `POST /api/payments/webhook` - Razorpay webhook handler

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/pending-requests` - Pending company approvals
- `PUT /api/admin/companies/:id/status` - Approve/reject companies
- `DELETE /api/admin/companies/:id` - Delete company

## 🔍 Advanced Search Features

### Route-Based Filtering
```javascript
GET /api/companies?departurePort=Mumbai&arrivalPort=Singapore
```

### Multi-Criteria Search
```javascript
GET /api/companies?cargoType=Electronics&shipmentType=Ship&minRating=4.0
```

### Pagination and Sorting
```javascript
GET /api/companies?page=1&limit=10&sortBy=rating&sortOrder=desc
```

## 💳 Payment Integration

The system integrates with