# Stock Trading Simulation — Frontend Documentation

A comprehensive React-based frontend for a full-stack MERN real-time paper trading and portfolio simulation engine with role-based access control, order execution routing, chronological clearing logs, and price alert watch rule triggers.

## Deployed Links

* **Frontend Deployed URL:** `https://stock-trading-simulation.vercel.app`
* **Backend API URL:** `https://stock-trading-simulation-ld2b.onrender.com`

---

## Project Setup & Installation

### 1. Create Vite React Project
```bash
# Create a new Vite project
npm create vite@latest

# Install dependencies
npm install

# Core dependencies
npm install react react-dom react-router-dom axios zustand react-hot-toast tailwindcss

# Tailwind CSS setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Additional dev dependencies
npm install -D @vitejs/plugin-react eslint

{
  "name": "stock-trading-simulation-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.13.1",
    "tailwindcss": "^4.2.1",
    "zustand": "^5.0.11"
  }
}

# Development server (runs on http://localhost:5173)
npm run dev -- --force

# Build for production
npm run build

# Preview production build
npm run preview

frontend/
├── public/                          # Static assets
├── src/
│   ├── components/                  # UI Layout & Feature Components
│   │   ├── APIDebugger.jsx          # Live JSON network payload terminal & tracer
│   │   ├── AdminDashboard.jsx       # Admin management matrix panel
│   │   ├── AssetByID.jsx            # Detailed asset workspace containing chart telemetry
│   │   ├── DashboardSummary.jsx     # Financial scorecards and open equity ledger
│   │   ├── ErrorBoundary.jsx        # Fallback UI crash interceptor
│   │   ├── Home.jsx                 # Marketing landing page
│   │   ├── Leaderboard.jsx          # Ranked ranking list based on user total net worth
│   │   ├── Login.jsx                # Session-restoring login matrix
│   │   ├── Market.jsx               # Active asset tickers screen
│   │   ├── PriceAlerts.jsx          # Custom guard rule boundary arming module
│   │   ├── ProtectedRoute.jsx       # Route protection guard with checking flags
│   │   ├── Register.jsx             # Public profile creation page
│   │   ├── RootLayout.jsx           # Nav structural wrapper layout
│   │   ├── TradeForm.jsx            # Dynamic execution buy/sell order processing ticket
│   │   ├── TraderDashboard.jsx      # Multi-tab sub-routed command center
│   │   ├── TradingHistory.jsx       # Chronological audit logs ledger
│   │   ├── Unauthorized.jsx         # 403 Access denied screen
│   │   └── config/
│   │       └── baseAPI.js           # Shared Axios instance configured with credentials
│   ├── store/
│   │   └── authStore.js             # Zustand state container featuring checking flags
│   ├── assets/                      # Media and graphic elements
│   ├── App.jsx                      # Main app layout and core router configuration
│   ├── index.css                    # Global CSS styles
│   └── main.jsx                     # Application rendering bootstrap script
├── .gitignore                       # Explicitly tracking rules (ignores .env and node_modules)
├── package.json                     # System manifest
└── README.md                        # Documentation handbook


Key Features & Navigation Flow
1. Home Page (/)
Description: Public landing page providing introductory info and layout access buttons.

Actions:

Get Started: Paths directly to /register (if unauthenticated) or bounces directly to dashboard context states (if an active session cookie exists).

Explore Live Market: Drops user into tickers feed.

2. User Registration (/register)
Description: Onboards new market participants.

Input Fields: First Name, Last Name, Email Address, Password.

Role Setup: Default values mapped as TRADER. Allows choosing ADMIN for development orchestration environments.

Backend Action: Calls POST /api/auth/register.

3. User Login (/login)
Description: Verification gate evaluating user profiles.

Session State Handling: Captures deep tracking redirect routes. If a user refreshes a sub-route (e.g., /trader-dashboard/history), the router guard caches the path via state location history and logs them straight back into that specific window instead of forcing a fallback to /market.

Backend Action: Calls POST /api/auth/login.

User Role-Specific Dashboards
Trader Command Center (/trader-dashboard)
An isolated sub-routed workspace managing paper trading configurations.

Dashboard Summary Sub-Route (/trader-dashboard)

Features: Compiles total account values, portfolio investment metrics, and active profit/loss calculations.

Backend Action: Calls GET /api/trader/dashboard-summary.

Trade History Logs Sub-Route (/trader-dashboard/history)

Features: Displays a detailed history table showing actions, quantities, execution pricing, and total cash metrics.

Backend Action: Calls GET /api/trader/history.

Leaderboard Ranking Sub-Route (/trader-dashboard/leaderboard)

Features: Displays a ranked table matching competitors by total current equity (Wallet Balance + Active Portfolio valuations).

Backend Action: Calls GET /api/trader/leaderboard.

Price Alerts Sub-Route (/trader-dashboard/alerts)

Features: Interactive configuration widget enabling traders to arm price watch rule metrics (ABOVE/BELOW).

Backend Action: Calls POST /api/trader/alerts and GET /api/trader/alerts.

Trading Mechanics
Order Ticket Window Form (TradeForm.jsx)
Description: Interactive component deployed on specific asset overview layouts handling trade orders.

Execution Mapping: Dynamically evaluates action toggle switches to target specific API endpoints:

Selecting BUY targets POST /api/trader/buy

Selecting SELL targets POST /api/trader/sell

State Syncing: Captures successful backend ledger outputs, extracting updated wallet details, and calls updateWalletBalance() to synchronize balances across global tracking banners instantly.

Core Utilities
1. API Connection Debugger Portal (/api-debug)
Description: An administrative monitoring tab built into your system router.

Features: Provides a graphical environment to manually trigger API routes, map test payloads, trace raw response telemetry structures, and inspect network logs directly inside the browser.

2. State Persistence Engine (ProtectedRoute.jsx)
Description: Intercepts path changes to prevent unwanted redirects during manual browser updates.

Features: Evaluates isCheckingAuth flags. While the background execution path runs the backend verification check (GET /api/auth/check-auth), it displays a temporary loading overlay instead of throwing the user back to the login screen.

State Management
Zustand Auth Store (store/authStore.js)
State Property	Data Type	Purpose
currentUser	Object | null	Stores current user data (wallet context balance, name, role metrics).
isAuthenticated	Boolean	Flag indicating if a user session is active.
isCheckingAuth	Boolean	Protects paths from resetting during page refreshes.
loading	Boolean	Tracks active transactional button spinning states.
error	String | null	Stores error messages returned from the API.
Core Action Handlers
login(userCreds): Hits POST /api/auth/login. Sets authorization contexts on success.

logout(): Clears out active cookies via POST /api/auth/logout and resets client state variables.

checkAuth(): Hits GET /api/auth/check-auth. Restores active user state contexts on page reloads.

updateWalletBalance(newBalance): Mutates currentUser.walletBalance in real time to keep asset balances synchronized across components.

Deployment & Repository Management Guide
1. Repository Cleanliness Reset
To ensure environment files containing sensitive credentials don't leak onto public repositories, clear out the tracking history index entirely from your command line:

Bash
# Clean out Git's cache tracking index recursively
git rm -r --cached .

# Re-index the codebase respecting all your .gitignore configurations
git add .

# Lock in changes and deploy updates cleanly up to your branch
git commit -m "chore: wipe out cached tracking history trail and lock down environment variables"
git push origin main
2. Vercel Production Routing Rules Configuration
To prevent React Router paths from throwing 404 Not Found messages on manual page refreshes, create a vercel.json configuration file inside your frontend root directory:

JSON
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
Troubleshooting Checklist
Getting Redirection Redirect Loops on Manual Page Refresh?
Ensure your ProtectedRoute.jsx intercepts evaluations while isCheckingAuth matches true by rendering a loading indicator instead of executing route bounces.

Trades Triggering 400 Bad Request Blocks?
Verify your TradeForm.jsx targets the correct split endpoints (/api/trader/buy or /api/trader/sell) based on the active transaction mode, instead of hitting the old /api/market/trade endpoint.

Git Displays Arrow Symbols On Directories?
This means an isolated nested .git tracking file is active inside a subfolder. Remove the hidden file using rm -rf frontend/.git, run git rm --cached frontend to clear the submodule reference, and run git add frontend to stage it as a standard directory.