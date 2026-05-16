Markdown
# 📈 MERN Trading Platform

A full-stack, real-time virtual trading platform built using the MERN stack (MongoDB, Express.js, React + Vite, Node.js). This application allows users to explore live financial markets, execute buy/sell orders, manage a virtual portfolio, and allows administrators to manage tradable assets.

## ✨ Features

* **Role-Based Access Control (RBAC):** Distinct interfaces and permissions for `TRADER` and `ADMIN` roles.
* **Secure Authentication:** JWT-based authentication using HTTP-Only cookies and bcrypt password hashing.
* **ACID Transactions:** Database-level transactions ensure that wallet deductions and portfolio additions happen securely and atomically (no partial trades).
* **Live Market View:** Users can view live asset prices, market caps, and browse top-performing stocks/cryptocurrencies.
* **Portfolio Management:** Real-time calculation of total invested value, average buy prices, and available cash balances.
* **Admin Control Panel:** Admins can list new assets to the exchange, update pricing, and monitor user activity.
* **File Uploads:** Integrated with Cloudinary & Multer for secure in-memory processing of user avatars and KYC documents.

---

## 🛠️ Tech Stack

**Frontend (Client)**
* React 18 (Bootstrapped with Vite)
* Zustand (State Management)
* React Router DOM (Routing & Protected Routes)
* Tailwind CSS (Styling)
* Axios (HTTP Client)

**Backend (Server)**
* Node.js & Express.js
* MongoDB & Mongoose (ODM)
* JSON Web Tokens (JWT) & Cookie Parser
* Cloudinary & Multer (Media Storage)
* Bcrypt.js (Cryptography)

---

## 📂 Project Structure

```text
trading-platform/
│
├── backend/                  # Express/Node.js Server
│   ├── APIs/                 # Route controllers (Auth, Market, Trader, Admin)
│   ├── config/               # Cloudinary & Multer configurations
│   ├── middlewares/          # JWT Verification & Error Handling
│   ├── models/               # Mongoose Schemas (User, Asset, Portfolio, Order)
│   ├── services/             # Business logic (Auth service)
│   ├── server.js             # Main server entry point
│   └── .env                  # Server environment variables
│
└── frontend/                 # React/Vite Application
    ├── src/
    │   ├── components/       # React Components (Layouts, Dashboards, Forms)
    │   ├── store/            # Zustand stores (authStore, marketStore)
    │   ├── App.jsx           # App routing setup
    │   └── main.jsx          # React DOM render
    ├── vite.config.js        # Vite build configuration
    └── package.json          # Frontend dependencies
🚀 Getting Started
Prerequisites
Before you begin, ensure you have met the following requirements:

You have installed the latest version of Node.js

You have a MongoDB Atlas cluster set up (or a local MongoDB instance).

You have a free Cloudinary account for image uploads.

1. Backend Setup
Open your terminal and navigate to the backend directory:

Bash
cd backend
Install the dependencies:

Bash
npm install
Create a .env file in the /backend folder and add the following variables:

Code snippet
PORT=4000
NODE_ENV=development
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_string_12345

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start the backend development server:

Bash
npm run dev
# Server should start on http://localhost:4000
2. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
Install the dependencies:

Bash
npm install
Start the Vite development server:

Bash
npm run dev
# App should start on http://localhost:5173
🔗 Core API Endpoints
Authentication (/auth-api)
POST /register - Register a new Trader (automatically grants $10,000 demo cash).

POST /login - Authenticate user and set HTTP-Only JWT cookie.

GET /logout - Clear session cookies.

GET /check-auth - Validate active session on page refresh.

Market (/market-api) - Public/Protected
GET /assets - Fetch all active tradable assets.

GET /asset/:id - Fetch details of a specific asset.

Trader (/trader-api) - Requires TRADER Role
POST /buy - Execute a buy order (deducts wallet, adds to portfolio).

POST /sell - Execute a sell order (removes from portfolio, adds to wallet).

GET /portfolio - Fetch the logged-in user's holdings.

Admin (/admin-api) - Requires ADMIN Role
POST /asset - List a new asset on the exchange.

PUT /asset/halt/:id - Suspend trading for a specific asset.

GET /users - View all registered platform users.