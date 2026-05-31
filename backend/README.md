# Stock Trading Simulation - Backend Service Documentation

This service forms the core backend of the Stock Trading Simulation Platform. It is built as a RESTful and WebSockets-enabled Node.js and Express server that integrates with MongoDB Atlas using Mongoose. The service coordinates role-based user management, database transactions, a real-time asset price simulation engine, custom price alert notifications, automated stop-loss and take-profit order execution, and integrated artificial intelligence doubt clearance.

---

## Architectural Workflow and Key Services

The backend manages multiple synchronized systems to support real-time paper trading:

### 1. Real-Time Price Simulation Engine
A primary background routine running on the Node.js event loop handles market simulation:
*   **Time Interval:** Runs every 5 seconds.
*   **Mechanism:** Fetches all active assets from MongoDB, applies a random price fluctuation between -1% and +1%, enforces a minimum price of $1.00, and commits the updated price back to the database.
*   **WebSockets Broadcast:** After updating the database, the server broadcasts the full array of updated prices (`_id`, `symbol`, `currentPrice`, and price direction `isUp`) to all connected socket clients via the `market-data-update` channel.

### 2. Price Alert Evaluation System
Within the same 5-second interval, the backend evaluates user-defined price alerts:
*   **Evaluation:** Checks the `AlertModel` for active, untriggered alert rules matching the fluctuated asset.
*   **Alert Rules:**
    *   **ABOVE:** Triggers when the asset's current price rises to or exceeds the target threshold.
    *   **BELOW:** Triggers when the asset's current price falls to or drops below the target threshold.
*   **Action:** If a rule is satisfied, the server marks the alert as triggered (`isTriggered = true`), saves it, and emits a targeted WebSocket notification (`price-alert-notification`) to the individual user's socket room.

### 3. Automated Stop-Loss and Take-Profit Order Execution
The platform supports automated conditional order liquidation:
*   **Order Lookup:** The engine scans the `ConditionalOrderModel` for pending orders corresponding to active assets.
*   **Trigger Conditions:**
    *   **TAKE_PROFIT:** Executes when the current asset price meets or exceeds the target price.
    *   **STOP_LOSS:** Executes when the current asset price drops to or below the target price.
*   **Execution Safety and Wallet Settlement:**
    *   The engine verifies the user's holdings. If the user does not possess sufficient quantity of the asset, the order status is marked as `FAILED` and `executed = true`.
    *   If holdings are sufficient, the server calculates liquidation revenue (`quantity * currentPrice`), updates the user's wallet balance, subtracts the shares from their portfolio (removing the asset block from the database entirely if shares fall to 0), records a completed sell trade into the `OrderModel` ledger, and marks the conditional order as `EXECUTED` (`executed = true`).
    *   Finally, the server pushes a targeted WebSocket payload (`conditional-order-triggered`) to the trader's private room to provide instant interface updates.

---

## Authentication and Security Architecture

The backend implements security structures designed to resist exploit vectors:

1.  **Stateful Session Management via HTTP-Only Cookies:** Upon successful credentials verification or Google OAuth registration, the server generates a signed JSON Web Token (JWT). This token is appended to the response as a cookie with `httpOnly: true`, `secure: true`, and `sameSite: "none"` flags. This prevents Client-Side Scripting (XSS) attacks from reading user sessions.
2.  **Role-Based Access Control Middleware (`verifyToken.js`):** Intercepts route requests. It parses the incoming token, extracts user profile information, and matches the user's role against authorization parameters. Only authenticated users with matching roles (e.g., `TRADER` or `ADMIN`) are allowed to proceed.
3.  **Data Scrubbing and Clean Serialization:** The backend explicitly sanitizes user queries (e.g., `.select("-password")`) to ensure password hashes are never exposed across network payloads.
4.  **CORS Security:** Restricts incoming requests to whitelisted clients dynamically configured via environment properties.

---

## Database Schemas (Mongoose Models)

### 1. User Schema (`UserModel.js`)
Stores system participant credentials, wallet contexts, and personal settings:
*   `email` (String, required, unique): The primary identifier.
*   `password` (String, required): Cryptographically hashed password using bcrypt.
*   `firstName` (String, required): User's first name.
*   `lastName` (String): User's last name.
*   `role` (String, enum: `["TRADER", "ADMIN"]`, default: `"TRADER"`): Controls route-level authorization.
*   `walletBalance` (Number, default: `100000.00`): The cash balance available for trades.
*   `watchlist` (Array of ObjectId references targeting `AssetModel`): Saved stocks or crypto tickers.
*   `isActive` (Boolean, default: `true`): Administrative account toggle.

### 2. Asset Schema (`AssetModel.js`)
Represents the database of tradable items:
*   `symbol` (String, required, unique): Uppercased asset code (e.g., `"AAPL"`, `"BTC"`).
*   `name` (String, required): Descriptive title.
*   `currentPrice` (Number, required): Current spot price.
*   `marketCap` (Number): Dynamic market capitalization metric.
*   `isActive` (Boolean, default: `true`): Toggles public tradability.

### 3. Portfolio Schema (`PortfolioModel.js`)
Maps aggregated asset positions to unique user nodes:
*   `user` (ObjectId targeting `UserModel`, required): Owner of the holding.
*   `asset` (ObjectId targeting `AssetModel`, required): Reference to the held instrument.
*   `quantity` (Number, required, minimum 0): Quantified shares or coins.
*   `averageBuyPrice` (Number, required): Tracks the average cost basis of the position to compute dynamic Profit and Loss (P&L).

### 4. Order Schema (`OrderModel.js`)
Maintains an immutable ledger of transactions for historical analysis:
*   `user` (ObjectId targeting `UserModel`, required): Initiating trader.
*   `asset` (ObjectId targeting `AssetModel`, required): Target financial instrument.
*   `orderType` (String, enum: `["BUY", "SELL"]`, required): Action taken.
*   `quantity` (Number, required): Transaction volume.
*   `priceAtExecution` (Number, required): Asset price at the exact moment of transaction.
*   `totalAmount` (Number, required): Total transaction value (`quantity * priceAtExecution`).
*   `status` (String, default: `"COMPLETED"`): Transaction completion state.
*   `createdAt` (Date): Auto-generated timestamp.

### 5. Alert Schema (`AlertModel.js`)
Configures custom price triggers:
*   `user` (ObjectId targeting `UserModel`, required): Target of notification.
*   `asset` (ObjectId targeting `AssetModel`, required): Asset to track.
*   `targetPrice` (Number, required): Price limit value.
*   `condition` (String, enum: `["ABOVE", "BELOW"]`, required): Direction trigger.
*   `isTriggered` (Boolean, default: `false`): Flips to true upon satisfaction.

### 6. Conditional Order Schema (`ConditionalOrderModel.js`)
Stores stop-loss and take-profit parameters:
*   `user` (ObjectId targeting `UserModel`, required): Triggering profile.
*   `asset` (ObjectId targeting `AssetModel`, required): Held asset to liquidate.
*   `quantity` (Number, required, minimum 1): Position size to sell.
*   `triggerPrice` (Number, required): Targeted boundary.
*   `triggerType` (String, enum: `["STOP_LOSS", "TAKE_PROFIT"]`, required): Triggers selling.
*   `status` (String, enum: `["PENDING", "EXECUTED", "CANCELLED", "FAILED"]`, default: `"PENDING"`): Current state.
*   `executed` (Boolean, default: `false`): Execution completion state.

---

## Detailed Backend Directory and File Structure

Below is the comprehensive file structure of the backend service, outlining the specific role and operational responsibilities of every single file:

```text
backend/
├── APIs/                            # Express Route Controllers
│   ├── AdminAPI.js                  # Routes for managing system assets, halting trades, and viewing platform users
│   ├── AiAPI.js                     # Public AI routing endpoint using Groq SDK integration
│   ├── AuthAPI.js                   # Authentication endpoints (login, register, logout, Google OAuth, password recovery)
│   ├── MarketAPI.js                 # Public market endpoints (assets list, individual details, side-by-side compare, news)
│   └── TraderAPI.js                 # Protected trader routes (buy, sell, portfolio tracking, alert creation, conditional orders)
│
├── config/                          # Connection & Asset Config Systems
│   ├── cloudinary.js                # Configures the Cloudinary API client with cloud name, API key, and secret key
│   ├── cloudinaryUpload.js          # Middleware helper mapping Multer memory buffer uploads directly to Cloudinary
│   └── multer.js                    # Configures Multer in-memory storage for handling multi-part file uploads safely
│
├── middlewares/                     # Express Interceptor Pipeline
│   └── verifyToken.js               # JWT parsing, cookie extraction, token verification, and role authorization guard
│
├── models/                          # Mongoose ODM Collection Schemas
│   ├── AlertModel.js                # Schema mapping price notification alert criteria (ABOVE or BELOW targets)
│   ├── AssetModel.js                # Schema mapping tradable market tokens, current price, and status flags
│   ├── ConditionalOrderModel.js     # Schema mapping automated Stop-Loss and Take-Profit execution rules
│   ├── OrderModel.js                # Schema mapping immutable transaction histories for portfolio analysis
│   ├── PortfolioModel.js            # Schema mapping current aggregated asset holdings and average purchase prices
│   └── UserModel.js                 # Schema mapping profile accounts, hashed passwords, cash balances, and watchlists
│
├── services/                        # Business Logic Service Handlers
│   ├── authService.js               # Decoupled functions handling login credentials, password resets, and Google OAuth
│   ├── marketEngine.js              # Background service orchestrating WebSocket feeds and price alert boundary checks
│   └── newsService.js               # Service aggregating financial news feeds and computing overall market sentiments
│
├── .env                             # Active environment configuration parameters (omitted from repository tracking)
├── .gitignore                       # Explicit Git tracking ignore definitions (.env, node_modules, log files)
├── package.json                     # Main dependencies definition, start configurations, and server scripts
├── seed.js                          # Standalone seeding script populating baseline tradable assets into MongoDB Atlas
└── server.js                        # Primary application bootstrapper connecting database, websockets, and routes
```

---

## Detailed Explanation of Core Service Files

### 1. Root Server Bootstrapper (`server.js`)
*   **Purpose:** The entry point of the server application.
*   **Responsibilities:** Initializes the HTTP server wrapping the Express app, attaches the Socket.io server engine, configures CORS origins, registers the cookie parser, attaches all API route matrices (`/api/auth`, `/api/market`, `/api/trader`, `/api/admin`, `/api/ai`), establishes the Mongoose MongoDB connection, and starts the background price engine simulator.

### 2. Market Simulation Engine (`services/marketEngine.js`)
*   **Purpose:** Handles the continuous, multi-threaded market movement simulation.
*   **Responsibilities:** Evaluates price fluctuations every 5 seconds. Connects directly to the database to modify prices, broadcasts updates via Socket.io (`realtime-ticker-feed`), scans the active `AlertModel` records to trigger user-targeted alerts, and pushes targeted WebSocket packets to private rooms.

### 3. Authentication Services (`services/authService.js`)
*   **Purpose:** Houses all logic related to identity management and credentials processing.
*   **Responsibilities:** Encrypts user passwords using bcrypt hashing, validates input logs, signs JSON Web Tokens for secure session cookie creation, communicates with Google APIs to resolve OAuth tokens, and generates hashed recovery keys for password resets.

### 4. Sentiment and News Aggregator (`services/newsService.js`)
*   **Purpose:** Pulls external headlines and calculates overall market trends.
*   **Responsibilities:** Fetches relevant financial news articles, processes headlines to categorize them as bullish, bearish, or neutral, and calculates an aggregated sentiment score alongside confidence ratings.

### 5. Media Handlers (`config/cloudinary.js`, `config/cloudinaryUpload.js`, `config/multer.js`)
*   **Purpose:** Integrates user media processing.
*   **Responsibilities:** Multer catches file streams, keeping media blocks within RAM buffers. Cloudinary APIs securely upload these buffers to cloud storage endpoints, returning CDN-optimized links.

---

## Environmental Variable Blueprint

Deploying the service requires a secure, populated `.env` file in the service root folder:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Local runtime socket port parameter | `4000` |
| `FRONTEND_URL` | Domain route parameters for client origin validation | `http://localhost:5173` |
| `DB_URL` | MongoDB cluster connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Token encryption key | `a_highly_cryptographically_secure_hash_string` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary integration cloud space name | `your_cloudinary_cloud_name_placeholder` |
| `CLOUDINARY_API_KEY` | Cloudinary access authentication identifier key | `your_cloudinary_api_key_placeholder` |
| `CLOUDINARY_API_SECRET` | Cloudinary access credentials private signature | `your_cloudinary_api_secret_placeholder` |
| `GOOGLE_CLIENT_ID` | OAuth integration access identity key | `your_google_oauth_client_id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth integration private validation token | `GOCSPX-your_google_oauth_client_secret` |
| `GOOGLE_REDIRECT_URI` | Identity handshake redirect backend callback target | `http://localhost:4000/api/auth/google/callback` |
| `AI_API_NAME` | Identifier value returned in assistant responses | `Stock-Trading-Platform` |
| `AI_API_SECRET_KEY` | Groq secure platform validation key | `gsk_your_groq_api_key_placeholder` |