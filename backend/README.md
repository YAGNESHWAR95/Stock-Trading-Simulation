# Stock Trading Simulation — Backend API Documentation

A complete Node.js + Express + MongoDB backend for a full-stack MERN real-time paper trading and portfolio simulation engine featuring secure JWT authentication via HTTP-only cookies, role-based access control, transaction ledger isolation, and custom price alert rule evaluation.

## Deployed Links

* **Backend API URL:** `http://localhost:4000` (Development)
* **Deployed Backend URL:** `https://stock-trading-simulation-ld2b.onrender.com` 
* **Frontend URL:** `https://stock-trading-simulation.vercel.app`

---

## Project Setup & Installation

### 1. Initialize Project Environment
```bash
# Initialize npm project (creates package.json)
npm init -y

# Core server infrastructure
npm install express mongoose dotenv

# Authentication, Session Stability & Security
npm install jsonwebtoken bcryptjs cookie-parser cors

# Development Utilities
npm install --save-dev nodemon

{
  "name": "stock-trading-simulation-backend",
  "version": "1.0.0",
  "description": "Stock Trading Simulation Engine Backend API",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.2.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}

# Server Configuration Pipeline
PORT=4000

# Database Persistence Node
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/stock-sim?retryWrites=true&w=majority

# Security Encryption Keys
JWT_SECRET=your_super_cryptographically_secure_secret_jwt_key_here

# Development mode featuring hot-reloads via nodemon
npm run dev

# Production execution sequence
npm start

backend/
├── APIs/                            # Route Orchestrator Controllers
│   ├── AuthAPI.js                  # Registration, profile checkpoints, and session verification
│   ├── MarketAPI.js                 # Global tickers database seeding and market details
│   ├── TraderAPI.js                 # Portfolio transactions, execution orders, and monitoring rules
│   └── AdminAPI.js                  # Administrative profile metrics and system overrides
├── config/                          # Connection managers
│   └── db.js                        # Mongoose MongoDB clustering handshake configuration
├── middlewares/                     # Pipeline Interceptors
│   └── verifyToken.js               # JWT state extractor and explicit role authorization guard
├── models/                          # Database Collections Mapping (Mongoose Schemas)
│   ├── UserModel.js                 # User records (first/last names, hashed passwords, wallet balances)
│   ├── AssetModel.js                # Product details (symbols, names, real-time current spot prices)
│   ├── PortfolioModel.js            # Aggregated holdings matrices tracked per user account node
│   ├── OrderModel.js                # Chronological transactional audit logs ledger
│   └── AlertModel.js                # Price guard rule conditional constraints entries
├── .env                            # Environment variables (Locally retained; omitted from tracking)
├── .gitignore                      # Git tracking boundary instructions file
├── trade_testing.http               # REST Client automation script for execution debugging
├── package.json                    # Dependencies manifest configuration
└── server.js                       # Primary application bootstrapper entry point


Shared Middlewares
Token and Role Verification (middlewares/verifyToken.js)
An interception guard that validates incoming sessions before reaching underlying data routes:

Intercepts incoming packets, parsing the token stored in your secure HTTP-only cookie.

Decodes credentials using the shared encryption key context variable (JWT_SECRET).

Evaluates role privileges against white-listed arrays passed into the route rule configuration parameters.

Appends data payload metadata contexts directly into Express pipeline parameters (req.user).

Usage Strategy: verifyToken("TRADER") or verifyToken("TRADER", "ADMIN").

📡 API Endpoints Matrix
Public Authentication Routes (/api/auth)
1. Public Account Creation
Endpoint: POST /api/auth/register

Description: Creates a brand new individual account, setting default starting wallet parameters.

Request Payload Body:

JSON
{
  "email": "trader@example.com",
  "password": "password123",
  "firstName": "Yagneshwar",
  "lastName": "Dev"
}
Response Details (201 Created):

JSON
{
  "message": "User registered successfully",
  "payload": {
    "_id": "6a1033b7ecaa325a37e1125e",
    "email": "trader@example.com",
    "firstName": "Yagneshwar",
    "lastName": "Dev",
    "role": "TRADER",
    "walletBalance": 100000.00,
    "isActive": true
  }
}
2. Session Token Acquisition
Endpoint: POST /api/auth/login

Description: Processes login queries, appending a signed JWT to an HTTP-only payload cookie container.

Request Payload Body:

JSON
{
  "email": "trader@example.com",
  "password": "password123"
}
Response Details (200 OK):

JSON
{
  "message": "Login successful",
  "payload": {
    "_id": "6a1033b7ecaa325a37e1125e",
    "firstName": "Yagneshwar",
    "role": "TRADER",
    "walletBalance": 100000.00
  }
}
Cookies Appended: Set-Cookie: token=<JWT_STRING>; HttpOnly; Secure; SameSite=Lax; Path=/

Trader Action Route Trees (/api/trader)
All endpoints below require an authenticated token matching the target role restriction (TRADER).

3. Route Buy Order Placement
Endpoint: POST /api/trader/buy

Description: Deducts capital limits from wallet balances, updates position structures inside holding schemas, and pushes records to the chronological logging tracker.

Request Payload Body:

JSON
{
  "assetId": "6b2044c8edbb436b48f2236f",
  "quantity": 10
}
Response Details (200 OK):

JSON
{
  "message": "Trade executed successfully",
  "walletBalance": 93500.00
}
4. Route Sell Order Processing
Endpoint: POST /api/trader/sell

Description: Verifies that existing portfolio quantities are sufficient to meet the trade volume request, increments the available cash balance, scales down holding balances, and appends transaction events to the clearing history log.

Request Payload Body:

JSON
{
  "assetId": "6b2044c8edbb436b48f2236f",
  "quantity": 5
}
Response Details (200 OK):

JSON
{
  "message": "Sell executed successfully",
  "walletBalance": 96750.00
}
5. Compile Account Financial Metrics
Endpoint: GET /api/trader/dashboard-summary

Description: Aggregates portfolio holdings, computes overall invested capital sums against market spot variances, and calculates dynamic net return percentages.

Response Details (200 OK):

JSON
{
  "message": "Dashboard summary details compiled",
  "payload": {
    "walletBalance": 96750.00,
    "totalInvestedValue": 3250.00,
    "totalCurrentValue": 3500.00,
    "totalPnL": 250.00,
    "totalPnLPercentage": 7.69,
    "portfolioBreakdown": [
      {
        "assetId": "6b2044c8edbb436b48f2236f",
        "assetName": "Apple Inc.",
        "symbol": "AAPL",
        "quantity": 5,
        "avgBuyPrice": 150.00,
        "currentPrice": 160.00,
        "investedValue": 750.00,
        "currentValue": 800.00,
        "pnl": 50.00,
        "pnlPercentage": 6.67
      }
    ]
  }
}
6. Extract Order Execution Audits
Endpoint: GET /api/trader/history

Description: Extracts chronological logs associated with target users, populating matching ticker references.

Response Details (200 OK):

JSON
{
  "message": "Historical trade metrics",
  "payload": [
    {
      "_id": "6c3055d9fcee547c59a3347a",
      "orderType": "BUY",
      "quantity": 10,
      "priceAtExecution": 150.00,
      "totalAmount": 1500.00,
      "status": "COMPLETED",
      "asset": { "symbol": "AAPL", "name": "Apple Inc." },
      "createdAt": "2026-05-23T06:12:00.000Z"
    }
  ]
}
7. Arm Price Alert Trigger Conditions
Endpoint: POST /api/trader/alerts

Description: Registers target metric thresholds into checking collections.

Request Payload Body:

JSON
{
  "assetId": "6b2044c8edbb436b48f2236f",
  "targetPrice": 175.00,
  "condition": "ABOVE"
}
Response Details (201 Created):

JSON
{
  "message": "Price change trigger rules saved",
  "payload": {
    "_id": "6d4066e0adff658d60b4458b",
    "condition": "ABOVE",
    "targetPrice": 175.00,
    "isTriggered": false
  }
}
8. Retrieve Armed Condition Watch Rules
Endpoint: GET /api/trader/alerts

Description: Looks up active rule logs matching a user profile where isTriggered is false.

Response Details (200 OK):

JSON
{
  "message": "Active Price Watch Triggers",
  "payload": [
    {
      "_id": "6d4066e0adff658d60b4458b",
      "condition": "ABOVE",
      "targetPrice": 175.00,
      "asset": { "symbol": "AAPL", "name": "Apple Inc.", "currentPrice": 160.00 }
    }
  ]
}
9. Global Standings Matrix Compilation
Endpoint: GET /api/trader/leaderboard

Description: Publicly available endpoint calculating overall individual user valuations (Cash holdings + Portfolio valuations) ranked descending.

Response Details (200 OK):

JSON
{
  "message": "Top Active Traders Leaderboard",
  "payload": [
    {
      "username": "Yagneshwar Dev",
      "walletBalance": 96750.00,
      "portfolioValue": 3500.00,
      "totalNetWorth": 100250.00
    }
  ]
}
Data Models Configuration
User Model Profile Schema (models/UserModel.js)
JavaScript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  role: { type: String, enum: ["TRADER", "ADMIN"], default: "TRADER" },
  walletBalance: { type: Number, default: 100000.00 },
  isActive: { type: Boolean, default: true }
}
Order Tracking Schema (models/OrderModel.js)
JavaScript
{
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  asset: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
  orderType: { type: String, enum: ["BUY", "SELL"], required: true },
  quantity: { type: Number, required: true },
  priceAtExecution: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "COMPLETED" }
}
Pipeline Architectures Overview
1. Order Processing Flow
Plaintext
Client Order Request
   ↓
POST /api/trader/buy
   ↓
verifyToken Interception (Validates TRADER role context)
   ↓
Check Asset Model for spot price verification
   ↓
Verify wallet balance inside User document schema
   ↓
Deduct balance / Push item matrix into Portfolio tracking collections
   ↓
Record transaction logs into Order ledger
   ↓
Return remaining wallet cash configurations
2. State Session Verification Flow
Plaintext
Browser Hard Refresh (Wipes frontend UI client memory space)
   ↓
App.jsx runs mounting useEffect layout hooks
   ↓
GET /api/auth/check-auth fires silently
   ↓
Server extracts encrypted cookie tokens
   ↓
Decodes payloads using JWT_SECRET
   ↓
Returns user context fields (Prevents routing back to login)
Security Framework Implementation
Secure Storage: Transaction authorization signatures are retained inside non-exploitable httpOnly cookie channels. This design protects tokens against Cross-Site Scripting (XSS) extraction attempts.

Data Cleansing: User tracking query filters use explicit query restrictions, filtering out password fields (.select("-password")) before sending user objects across the network.

CORS Access Rules Control: Configuration setups use hardcoded front-end routing lists, dropping any unlisted port access attempts to protect data integrity.