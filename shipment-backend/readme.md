# 🚀 Quick Start Guide - SurakshitSafar Backend

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ (`node --version`)
- ✅ MongoDB v5+ (`mongod --version`)
- ✅ Redis v6+ (`redis-cli --version`)
- ✅ npm or yarn (`npm --version`)

## 5-Minute Setup

### Step 1: Project Setup (1 min)

```bash
# Navigate to project directory
cd shipment-backend

# Install dependencies
npm install
```

### Step 2: Environment Configuration (1 min)

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings (use nano, vim, or any editor)
nano .env
```

**Minimum Required Settings:**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/shipment_insurance
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_REFRESH_SECRET=your_super_secret_refresh_key_67890
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start Services (1 min)

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Redis
redis-server

# Terminal 3: Seed database
npm run seed
```

### Step 4: Run Backend (1 min)

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

**✅ Backend is now running on http://localhost:5000**

### Step 5: Test API (1 min)

```bash
# Test health endpoint
curl http://localhost:5000/api/v1/health

# Expected response:
# {"status":"OK","timestamp":"...","services":{...}}
```

## Default Login Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shipment.com | Admin@123 |
| Moderator | mod@shipment.com | Mod@123 |
| User | demo@example.com | Demo@123 |

## Testing with Postman

1. Import `Postman_Collection.json`
2. Set base_url variable to `http://localhost:5000/api/v1`
3. Run "Login" request with admin credentials
4. Token will auto-save for authenticated requests

## Connecting React Frontend

In your `App.jsx`, update the API URL:

```javascript
const API_URL = 'http://localhost:5000/api/v1';

// Example: Login request
const handleLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }
};

// Example: Submit claim
const handleClaimSubmit = async (policyId, description, claimAmount) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_URL}/claims`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ policyId, description, claimAmount })
  });
  
  const data = await response.json();
  if (data.success) {
    alert('Claim submitted — see you in future');
  }
};
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error
```bash
# Solution: Ensure MongoDB is running
sudo systemctl start mongod
# Or on Mac:
brew services start mongodb-community
```

### Issue: Redis Connection Error
```bash
# Solution: Start Redis server
redis-server
# Or on Mac:
brew services start redis
```

### Issue: Port 5000 Already in Use
```bash
# Solution: Change PORT in .env
PORT=3000
```

### Issue: JWT Token Errors
```bash
# Solution: Set proper JWT secrets in .env
JWT_SECRET=use_a_long_random_string_here
JWT_REFRESH_SECRET=use_another_long_random_string
```

## Project Structure Overview

```
shipment-backend/
├── server.js              # Entry point
├── src/
│   ├── config/           # DB & Redis setup
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Auth & validation
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── scripts/          # seed.js
│   └── utils/            # Helpers
├── logs/                 # Winston logs
└── .env                  # Environment config
```

## Key API Endpoints

### Public Endpoints (No Auth Required)
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/companies` - List companies
- `POST /api/v1/companies` - Submit company

### Private Endpoints (Auth Required)
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/claims` - Submit claim
- `GET /api/v1/policies` - Get policies
- `GET /api/v1/shipments` - Get shipments

### Admin Endpoints (Admin/Moderator Only)
- `PUT /api/v1/companies/:id/approve` - Approve company
- `PUT /api/v1/claims/:id/review` - Review claim
- `GET /api/v1/admin/dashboard/stats` - Dashboard stats

## Development Tips

### Enable Debug Logging
```bash
NODE_ENV=development npm run dev
```

### Watch Logs in Real-Time
```bash
tail -f logs/combined-*.log
```

### Reset Database
```bash
npm run seed
```

### Test Email Sending
Use Gmail with App Password:
1. Enable 2FA on Gmail
2. Generate App Password
3. Set SMTP_USER and SMTP_PASS in .env

## Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas connection string
- [ ] Set strong JWT secrets (min 32 characters)
- [ ] Configure production SMTP server
- [ ] Set proper CORS_ORIGIN
- [ ] Enable SSL/HTTPS
- [ ] Set up process manager (PM2)
- [ ] Configure backup strategy
- [ ] Set up monitoring (logs)

## Next Steps

1. ✅ Backend is running
2. 🔄 Test endpoints with Postman
3. 🎨 Connect React frontend
4. 📧 Configure email notifications
5. 🚀 Deploy to production

## Support

- Documentation: See README.md
- API Testing: Import Postman collection
- Issues: Check logs/ directory
- Email: support@surakshitsafar.com

---

**Happy Coding! 🎉**