# SurakshitSafar Backend - Shipment Insurance Platform API

🚢 Production-ready backend API for managing shipment insurance companies, policies, and claims.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Frontend Integration](#frontend-integration)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Role-based access control (Admin, Moderator, User)
  - Secure password hashing with bcrypt
  - Token rotation and refresh mechanism

- **Company Management**
  - Create, read, update, delete companies
  - Approve/reject company submissions
  - Track clicks, views, and quotes
  - Multi-criteria search and filtering

- **Shipment & Policy Management**
  - Create and track shipments
  - Generate insurance policies
  - Link policies to shipments and companies

- **Claims System**
  - Submit insurance claims
  - Review and approve/reject claims
  - Audit trail for all claim actions
  - Email notifications for claim status

- **Caching & Performance**
  - Redis caching for frequently accessed data
  - Automatic cache invalidation
  - Pagination support

- **Logging & Monitoring**
  - Winston logger with daily log rotation
  - Request correlation IDs
  - Structured JSON logging

- **Security**
  - Helmet.js for security headers
  - CORS protection
  - Rate limiting
  - NoSQL injection prevention
  - Input sanitization

## 🛠 Tech Stack

- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Cache:** Redis
- **Authentication:** JWT (jsonwebtoken)
- **Email:** Nodemailer
- **Logging:** Winston
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** Joi / express-validator

## 📂 Project Structure

```
shipment-backend/
├── logs/                       # Winston log files
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── shipmentController.js
│   │   ├── policyController.js
│   │   └── claimController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Shipment.js
│   │   └── Policy.js (includes Claim)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── shipmentRoutes.js
│   │   ├── policyRoutes.js
│   │   ├── claimRoutes.js
│   │   ├── adminRoutes.js
│   │   └── index.js
│   ├── scripts/
│   │   └── seed.js            # Database seeding
│   └── utils/
│       ├── logger.js
│       ├── emailSender.js
│       └── responseHandler.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Redis (v6 or higher)
- npm or yarn

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd shipment-backend

# Install dependencies
npm install
```

### Step 2: Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

### Step 3: Start MongoDB and Redis

```bash
# Start MongoDB (local)
mongod

# Start Redis (local)
redis-server
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/shipment_insurance

# Redis
REDIS_URL=redis://127.0.0.1:6379

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Default Credentials
ADMIN_DEFAULT_EMAIL=admin@shipment.com
ADMIN_DEFAULT_PASS=Admin@123
MODERATOR_DEFAULT_EMAIL=mod@shipment.com
MODERATOR_DEFAULT_PASS=Mod@123
```

### Using MongoDB Atlas

Replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shipment_insurance?retryWrites=true&w=majority
```

## 🎬 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 🌱 Database Seeding

Seed the database with default users and demo data:

```bash
npm run seed
```

This creates:
- **Admin user:** admin@shipment.com / Admin@123
- **Moderator user:** mod@shipment.com / Mod@123
- **Demo user:** demo@example.com / Demo@123
- 3 demo companies
- 1 demo shipment
- 1 demo policy

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /api/v1/health
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/me` | Update profile | Private |
| PUT | `/auth/change-password` | Change password | Private |

### Company Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/companies` | Create company | Public |
| GET | `/companies` | Get all companies | Public |
| GET | `/companies/:id` | Get company by ID | Public |
| PUT | `/companies/:id` | Update company | Admin/Mod |
| DELETE | `/companies/:id` | Delete company | Admin |
| PUT | `/companies/:id/approve` | Approve company | Admin/Mod |
| PUT | `/companies/:id/reject` | Reject company | Admin/Mod |
| POST | `/companies/:id/click` | Track click | Public |

### Shipment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/shipments` | Create shipment | Private |
| GET | `/shipments` | Get all shipments | Private |
| GET | `/shipments/:id` | Get shipment by ID | Private |
| PUT | `/shipments/:id` | Update shipment | Private |
| DELETE | `/shipments/:id` | Delete shipment | Private |

### Policy Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/policies` | Create policy | Private |
| GET | `/policies` | Get all policies | Private |
| GET | `/policies/:id` | Get policy by ID | Private |
| PUT | `/policies/:id` | Update policy | Admin/Mod |

### Claim Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/claims` | Submit claim | Private |
| GET | `/claims` | Get all claims | Private |
| GET | `/claims/:id` | Get claim by ID | Private |
| PUT | `/claims/:id/review` | Review claim | Admin/Mod |
| PUT | `/claims/:id/status` | Update claim status | Admin/Mod |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/dashboard/stats` | Get dashboard stats | Admin/Mod |
| GET | `/admin/users` | Get all users | Admin |
| PUT | `/admin/users/:id/role` | Update user role | Admin |

## 🔗 Frontend Integration

### Setting Up the React Frontend

1. Update the API URL in `App.jsx`:

```javascript
const API_URL = 'http://localhost:5000/api/v1';
```

2. Add authentication headers to requests:

```javascript
const token = localStorage.getItem('accessToken');

fetch(`${API_URL}/claims`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(claimData)
})
```

### Claim Submission Example

Add this to your `App.jsx`:

```javascript
const [showClaimModal, setShowClaimModal] = useState(false);
const [selectedPolicy, setSelectedPolicy] = useState(null);

const handleClaimSubmit = async (claimData) => {
  const token = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch('http://localhost:5000/api/v1/claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        policyId: selectedPolicy.id,
        description: claimData.description,
        claimAmount: claimData.amount
      })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Claim submitted — see you in future');
      setShowClaimModal(false);
    }
  } catch (error) {
    console.error('Claim submission error:', error);
  }
};
```

## 🔒 Security Features

- **Helmet.js:** Sets secure HTTP headers
- **CORS:** Configured for specific origins
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **JWT:** Short-lived access tokens (15min) + refresh tokens (7days)
- **Password Hashing:** bcrypt with salt rounds
- **Input Sanitization:** NoSQL injection prevention
- **Request Validation:** Joi/express-validator

## 🚢 Deployment

### Deploying to Production

1. **Set Environment Variables:**
   - Use production MongoDB URI (Atlas)
   - Use production Redis URL
   - Set strong JWT secrets
   - Configure production SMTP
   - Set NODE_ENV=production

2. **Deploy to Heroku:**

```bash
heroku create shipment-backend
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_atlas_uri
git push heroku main
```

3. **Deploy to AWS/DigitalOcean:**
   - Use PM2 for process management
   - Set up Nginx as reverse proxy
   - Enable SSL with Let's Encrypt

### PM2 Configuration

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name shipment-backend

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Redis Connection Issues

```bash
# Check Redis status
redis-cli ping

# Start Redis
redis-server
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Email Not Sending

- Enable 2FA on Gmail
- Generate App Password
- Use App Password in SMTP_PASS

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "correlationId": "req-123456"
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## 📞 Support

For issues and questions:
- Email: support@surakshitsafar.com
- Documentation: [API Docs](http://localhost:5000/api/v1/health)

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by the SurakshitSafar Team**