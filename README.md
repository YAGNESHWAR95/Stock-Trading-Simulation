# Stock Trading Simulation Platform

A full-stack, enterprise-grade real-time paper trading and portfolio simulation platform built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform enables users to experience simulated live financial markets, execute immediate buy and sell orders, configure custom price alerts, set automated stop-loss and take-profit conditional orders, consult a Groq-powered artificial intelligence doubt assistant, monitor market news sentiment, and compete in a dynamic user leaderboard.

---

## Architecture and System Design

The application utilizes a distributed, real-time client-server architecture built on the following pipeline:

1.  **Frontend Client (Single Page Application):** Powered by React 18, Vite, and Zustand. It maintains persistent WebSockets connections to receive live price streams and user-specific notifications, while communicating with the backend API via secure HTTP requests.
2.  **Backend API Server:** An Express.js application running on Node.js. It manages REST endpoints, handles user authentication, coordinates database transactions, implements WebSockets rooms, and runs the real-time price simulation engine.
3.  **Database Persistence:** A MongoDB Atlas cloud cluster configured using Mongoose schemas. Transactions are used to ensure ACID compliance during trade executions.
4.  **Real-Time Price Engine:** An internal background simulator running on the backend that fluctuates active asset prices every 5 seconds, processes pending price alerts, evaluates conditional orders, updates the database, and broadcasts updates.
5.  **External AI Integration:** Communicates with the Groq API using the llama-3.3-70b-versatile model to provide context-aware, highly knowledgeable answers to trader questions.

---

## Role-Based Access Control

The platform implements strict Role-Based Access Control (RBAC) to ensure feature isolation:

*   **Trader:** Standard user role. Traders are authorized to view market tickers, execute manual buy and sell orders, deposit demo funds, configure price notifications, create automated conditional orders, view their personal portfolio and history, check the leaderboard, read news, and consult the AI doubt assistant.
*   **Admin:** System administrative role. Admins are granted access to a specialized Dashboard Matrix to list new assets, modify existing asset parameters, halt trading on specific assets, and monitor all registered traders.

---

## Technology Stack

### Frontend Application
*   **Core Framework:** React 18 (bundled with Vite)
*   **State Management:** Zustand (lightweight, decoupled state containers)
*   **Routing:** React Router DOM v7 (supports nested routes, layout wrappers, and session protection guards)
*   **WebSockets:** Socket.io-client (real-time bidirectional communication)
*   **Styling:** Tailwind CSS (utility-first premium interface development) and custom CSS variables
*   **HTTP Client:** Axios (configured with credentials and base interceptors)
*   **User Feedback:** React Hot Toast (non-blocking transactional micro-notifications)

### Backend Service
*   **Core Server:** Node.js and Express.js
*   **Object Data Modeling (ODM):** Mongoose and MongoDB Atlas
*   **WebSockets Server:** Socket.io (isolated user rooms and public broadcasts)
*   **Authentication:** JSON Web Tokens (JWT) stored in HTTP-Only, Secure, and SameSite=None cookies
*   **Password Security:** Bcrypt.js hashing
*   **Media Processing:** Multer and Cloudinary (for processing secure media uploads)
*   **AI Engine:** Groq SDK / HTTP Fetch integrations

---

## Repository Structure and Detailed File Map

The project is structured as a monorepo, separating the client-side single page application and the server-side microservice:

```text
Stock-Trading-Simulation/
├── README.md                          # Main repository documentation (this file)
│
├── backend/                           # Backend Service Root Directory
│   ├── APIs/                          # Route Controllers
│   │   ├── AdminAPI.js                # Admin endpoints (halting assets, listing new tokens)
│   │   ├── AiAPI.js                   # AI question routing endpoint using Groq integration
│   │   ├── AuthAPI.js                 # Session routes (login, registration, Google OAuth, password reset)
│   │   ├── MarketAPI.js               # Public market feeds, details, comparisons, and news endpoints
│   │   └── TraderAPI.js               # Protected trader operations (buy, sell, alerts, conditional orders)
│   ├── config/                        # Core Configuration System
│   │   ├── cloudinary.js              # Cloudinary API developer profile configuration
│   │   ├── cloudinaryUpload.js        # Helper streaming uploads directly to Cloudinary storage
│   │   └── multer.js                  # Express middleware handling memory-buffered file uploads
│   ├── middlewares/                   # Interceptor Pipeline
│   │   └── verifyToken.js             # JWT extraction, signature checks, and RBAC guard middleware
│   ├── models/                        # Mongoose Collection Schemas
│   │   ├── AlertModel.js              # Criteria model for custom trader price target alerts
│   │   ├── AssetModel.js              # Product listings, active prices, and state flags
│   │   ├── ConditionalOrderModel.js   # Settings model for automated Stop-Loss/Take-Profit triggers
│   │   ├── OrderModel.js              # Immutable system ledger mapping completed transactions
│   │   ├── PortfolioModel.js          # Aggregated open positions and average purchase price calculations
│   │   └── UserModel.js               # Profiles, hashed credentials, demo wallets, and watchlists
│   ├── services/                      # Decoupled Business Logic
│   │   ├── authService.js             # Logic for manual credentials processing and OAuth handshakes
│   │   ├── marketEngine.js            # Engine simulating live assets and scanning alert parameters
│   │   └── newsService.js             # Web fetcher scoring dynamic market sentiments from articles
│   ├── package.json                   # Backend manifest and starting commands
│   ├── README.md                      # Extensive backend service documentation handbook
│   └── server.js                      # Primary bootstrapper combining websockets, database, and APIs
│
└── frontend/                          # Frontend Application Root Directory
    ├── public/                        # Static static files
    ├── src/                           # Client Source Code
    │   ├── components/                # Modular Components and Layouts
    │   │   ├── config/                # Client Configuration
    │   │   │   ├── baseAPI.js         # Configured Axios instance mapping backend origins
    │   │   │   └── socket.js          # Managed Socket.io-client connection instance
    │   │   ├── AdminDashboard.jsx     # Controls panel reserved for admin profile users
    │   │   ├── AiDoubts.jsx           # Clean bot UI to consult the virtual assistant
    │   │   ├── AssetByID.jsx          # Dedicated single asset chart and trade ticket layout
    │   │   ├── AssetComparison.jsx    # Side-by-side token performance analytics module
    │   │   ├── BottomNav.jsx          # Mobile viewport sticky menu
    │   │   ├── CandlestickChart.jsx   # Charts displaying past asset ticks
    │   │   ├── ConditionalOrders.jsx  # Scheduler configuring automatic Buy/Sell orders
    │   │   ├── DashboardSummary.jsx   # Portfolio values tracker and allocation metrics
    │   │   ├── ErrorBoundary.jsx      # UI crash handler catch interface
    │   │   ├── Footer.jsx             # Corporate website footer layout
    │   │   ├── ForgotPassword.jsx     # Request workspace for user recovery tokens
    │   │   ├── Header.jsx             # Global navbar sync showing real-time wallet balance
    │   │   ├── Home.jsx               # Landing page outlining system technology details
    │   │   ├── Leaderboard.jsx        # Leaderboard ranking users by net worth
    │   │   ├── LiveTicker.jsx         # Scrolling ticker displaying asset spot adjustments
    │   │   ├── Login.jsx              # Login gate validating trader credentials
    │   │   ├── Market.jsx             # Interactive grid containing all listed assets
    │   │   ├── MarketNews.jsx         # Live articles stream alongside sentiment dials
    │   │   ├── PriceAlerts.jsx        # Widgets setting custom price alert thresholds
    │   │   ├── ProtectedRoute.jsx     # Route protection guard preventing path entries
    │   │   ├── Register.jsx           # Portal for creating new profiles
    │   │   ├── ResetPassword.jsx      # Completion interface using recovery keys
    │   │   ├── RootLayout.jsx         # Structural nav container
    │   │   ├── TradeForm.jsx          # Ticket interface routing order executions
    │   │   ├── TraderDashboard.jsx    # Layout organizing sub-routing tabs for profiles
    │   │   ├── TradingHistory.jsx     # Audit logs displaying completed orders
    │   │   ├── Unauthorized.jsx       # Interceptor screen displaying 403 blocks
    │   │   └── Watchlist.jsx          # Custom favorites tracker
    │   ├── store/                     # Zustand decoupled state engines
    │   │   ├── authStore.js           # Session and wallet balance persistence manager
    │   │   ├── marketStore.js         # REST baseline loading and WebSocket update listener
    │   │   └── newsStore.js           # Sentiment indicators and news polling coordinator
    │   ├── App.jsx                    # Routing wrapper establishing client paths
    │   ├── index.css                  # Global styles mapping Tailwind properties
    │   └── main.jsx                   # DOM bootstrap mounting application scripts
    ├── vercel.json                    # Routing rewrite script preventing SPA refresh issues
    ├── vite.config.js                 # Vite build settings
    ├── package.json                   # Frontend manifest and dependency records
    └── README.md                      # Extensive frontend application documentation handbook
```

---

## Getting Started and Installation

### Prerequisites
*   Node.js installed (v18 or higher is recommended)
*   MongoDB Atlas database instance (or a local MongoDB daemon)
*   Groq API Key (required for the AI Doubt Assistant feature)

### 1. Backend Service Setup
1.  Open your terminal and navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and populate it with the appropriate credentials:
    ```env
    PORT=4000
    DB_URL=your_mongodb_connection_string
    JWT_SECRET=your_cryptographically_secure_jwt_secret_key
    AI_API_SECRET_KEY=your_groq_api_key
    FRONTEND_URL=http://localhost:5173
    ```
4.  Optionally seed the database with initial market assets:
    ```bash
    node seed.js
    ```
5.  Start the backend service in development mode:
    ```bash
    npm run dev
    ```
    The server will boot and run on `http://localhost:4000`.

### 2. Frontend Application Setup
1.  Open a separate terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite local development server:
    ```bash
    npm run dev
    ```
    The application will boot and run on `http://localhost:5173`.

---

## Main Core Features

1.  **Real-Time Price Engine:** Backend-driven market simulation engine that adjusts asset prices every 5 seconds and instantly broadcasts updates across active client interfaces using WebSockets.
2.  **Custom Price Alerts:** Users can register custom alerts for active assets (e.g., alert when AAPL is ABOVE 180 or BELOW 160). When the criteria are satisfied, the backend fires a private notification directly to that user's screen.
3.  **Automated Stop-Loss and Take-Profit Orders:** Traders can place conditional orders that execute automatically. If an asset hits a user's specified Take Profit or Stop Loss price, the backend clears the trade, updates their wallet balance, logs the transaction, and pushes a notification.
4.  **Groq AI Doubt Assistant:** An integrated natural language processor model (`llama-3.3-70b-versatile`) which provides immediate responses to trading-related queries, accessible directly from the trader dashboard.
5.  **Market News & Sentiment Analysis:** Pulls financial articles, tracks positive or negative trends, aggregates overall market sentiment scores, and displays this information dynamically on the dashboard.
6.  **Interactive Asset Comparison:** Allows traders to compare multiple stock or crypto assets side-by-side using real-time values, market caps, and performance trends.

---

## Sub-Module Detailed Documentation

For a deep dive into the inner workings, database structures, APIs, and client-side layouts of each layer, please read their respective documentation:

*   For details on the backend server, database schemas, and core business services, view the [Backend Service Documentation](file:///c:/Users/YAGNESHWAR%20REDDY/Documents/Stock-Trading-Simulation/backend/README.md).
*   For details on frontend architecture, component layout trees, Zustand stores, and routing systems, view the [Frontend Application Documentation](file:///c:/Users/YAGNESHWAR%20REDDY/Documents/Stock-Trading-Simulation/frontend/README.md).