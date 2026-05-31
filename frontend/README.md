# Stock Trading Simulation - Frontend Application Documentation

This document describes the client-side single-page application (SPA) of the Stock Trading Simulation Platform. Built with React 18, Vite, Zustand, Tailwind CSS, React Router DOM, and Socket.io-client, the frontend provides a real-time, responsive trading command center. It includes interactive visualizations, custom price alert setups, automated conditional order management, dynamic comparison dashboards, real-time financial tracking cards, and an integrated AI trading doubt assistant.

---

## Architectural and Layout Workflow

The frontend acts as an interactive client interface, communicating with the backend via two main pipelines:

### 1. REST Operations (Axios)
*   **Instance Setup:** Managed by `src/components/config/baseAPI.js`, configured with `withCredentials: true` to ensure JWT cookie tokens are processed automatically during cross-origin requests.
*   **Use Cases:** Used for initial queries, registration/login sessions, setting alerts, registering conditional orders, pulling historical trade reports, and querying leaderboard details.

### 2. Live WebSockets Stream (Socket.io-client)
*   **Instance Setup:** Managed by `src/components/config/socket.js`, with `autoConnect: false` to allow controlled, deliberate connections post-authentication.
*   **Channels and Rooms:**
    *   **Global Broadcasts (`market-data-update`):** Receives continuous price arrays every 5 seconds. Pushes these prices directly into the global `marketStore.js` to update all charts and price indicators across the active workspace.
    *   **Authenticated Private Rooms (`join-user-room`):** Upon login, the client joins a user-specific WebSocket channel matching the logged-in user's database ID.
        *   **`price-alert-notification`:** Receives trigger alerts when prices cross custom boundaries, showing instant toast notifications on the trader's screen.
        *   **`conditional-order-triggered`:** Receives immediate updates when an automated Stop-Loss or Take-Profit conditional order is executed, automatically refreshing the user's wallet balance and portfolio indicators.

---

## Detailed Frontend Directory and File Structure

Below is the comprehensive file structure of the frontend application, outlining the specific role and operational responsibilities of every folder and code file:

```text
frontend/
├── public/                          # Static static files
│   └── (assorted graphics/icons)    # Graphic vectors and platform icons
│
├── src/                             # Application Source Directory
│   ├── components/                  # Modular Component Layers & Configuration
│   │   ├── config/                  # Core Connections Configuration
│   │   │   ├── baseAPI.js           # Declares Axios client, setting credentials flags and base APIs
│   │   │   └── socket.js            # Instantiates Socket.io-client mapping environment ports
│   │   │
│   │   ├── AdminDashboard.jsx       # Interface providing database asset listings and halting mechanisms
│   │   ├── AiDoubts.jsx             # Dedicated window for asking trading questions to Groq AI
│   │   ├── AssetByID.jsx            # Detailed view for a single asset (includes chart, trade ticket, and alert setups)
│   │   ├── AssetComparison.jsx      # Side-by-side asset analytics tracker comparing prices and market caps
│   │   ├── BottomNav.jsx            # Responsive navigation tab anchored on mobile devices
│   │   ├── CandlestickChart.jsx     # Financial visualizer plotting price timelines
│   │   ├── ConditionalOrders.jsx    # Component mapping automatic Stop-Loss/Take-Profit triggers
│   │   ├── DashboardSummary.jsx     # Financial dashboard displaying net worth, P&L, and asset allocations
│   │   ├── ErrorBoundary.jsx        # Fallback screen catching uncaught layout exceptions
│   │   ├── Footer.jsx               # Navigation bottom bar containing copy references
│   │   ├── ForgotPassword.jsx       # Public view enabling traders to request recovery tokens
│   │   ├── Header.jsx               # Header synchronizing live balances, news, and profile statuses
│   │   ├── Home.jsx                 # Marketing landing page detailing platform architecture
│   │   ├── Leaderboard.jsx          # Leaderboard listing competitors by total valuations
│   │   ├── LiveTicker.jsx           # Scrolling tickers giving visual updates of active fluctuations
│   │   ├── Login.jsx                # Session gateway evaluating user credentials
│   │   ├── Market.jsx               # Complete active storefront showing listed assets
│   │   ├── MarketNews.jsx           # News feed displaying bullish/bearish dials
│   │   ├── PriceAlerts.jsx          # Settings page for custom price notifications
│   │   ├── ProtectedRoute.jsx       # Protection guard redirecting unauthenticated users
│   │   ├── Register.jsx             # Public onboard portal for creating new trader profiles
│   │   ├── ResetPassword.jsx        # Credentials resetting window using token parameters
│   │   ├── RootLayout.jsx           # Master structural wrapper organizing navigation layouts
│   │   ├── TradeForm.jsx            # Executable trade ticket handling buy and sell orders
│   │   ├── TraderDashboard.jsx      # Container routing internal pages of user profiles
│   │   ├── TradingHistory.jsx       # Audit logs tab listing executed orders
│   │   ├── Unauthorized.jsx         # Access restriction error display screen (403 blocks)
│   │   └── Watchlist.jsx            # Favorites dashboard rendering tracked assets
│   │
│   ├── store/                       # Zustand Decoupled State Engines
│   │   ├── authStore.js             # Session credentials persistence and wallet balance synchronization
│   │   ├── marketStore.js           # Baseline market loading state and socket updates listener
│   │   └── newsStore.js             # Financial news articles aggregator and sentiment polling coordinator
│   │
│   ├── App.jsx                      # App router mapping structural routes and paths
│   ├── index.css                    # Master styling script setting up custom variables and CSS overrides
│   └── main.jsx                     # Entry mount loading index files into the DOM tree
│
├── vercel.json                      # Rewrites configuration protecting routes during browser refreshes
├── vite.config.js                   # Compiler and build settings for Vite bundling
├── package.json                     # Dependency manifests, packages definitions, and development script shortcuts
└── README.md                        # Extensive frontend application documentation handbook (this file)
```

---

## Detailed Explanation of Core Views

### 1. Unified Dashboard Summary (`DashboardSummary.jsx`)
*   **Purpose:** The central scorecard of the trader command center.
*   **Responsibilities:** Renders real-time net worth cards, available cash holdings, total invested portfolios worth, and live Profit and Loss metrics. Dynamically sorts open assets by P&L performance, displays asset allocation percentage tables, and maps performance rankings.

### 2. Live Market Storefront (`Market.jsx` & `Watchlist.jsx`)
*   **Purpose:** The primary interface for browsing and tracking trade opportunities.
*   **Responsibilities:** Connects to `marketStore.js` to draw listed assets, updates prices dynamically using WebSockets broadcast feeds, filters items via search inputs, handles adding assets to watchlists, and routes clicks to single-asset detailed workspaces.

### 3. Integrated AI Assistant (`AiDoubts.jsx`)
*   **Purpose:** Virtual assistant interface for user inquiries.
*   **Responsibilities:** Implements an instant messaging shell allowing users to write trading doubt queries. Fires asynchronous post commands targeting the protected backend router, streams responses, and tracks conversations inside an elegant scroll container.

---

## State Management Engine (Zustand Stores)

State stores are located in `src/store/` to separate application states from layout rendering:

### 1. Authentication Store (`authStore.js`)
Tracks the active user session and wallet balance:
*   **State Fields:**
    *   `currentUser` (Object): Active user credentials, roles, and real-time wallet details.
    *   `isAuthenticated` (Boolean): Session validity indicator.
    *   `loading` (Boolean): Controls button loading indicators.
    *   `isCheckingAuth` (Boolean): Holds route redirects while background token checks are active.
    *   `error` (String): Diagnostic logs.
*   **Actions:**
    *   `login(credentials)` (Async): Hits backend `/api/auth/login`, stores user object, and connects WebSockets.
    *   `logout()` (Async): Hits `/api/auth/logout`, cleans cookie, resets store, and disconnects WebSockets.
    *   `checkAuth()` (Async): Hits `/api/auth/check-auth` on mounting to restore session context on page refresh.
    *   `updateWalletBalance(newBalance)`: Safely synchronizes changes in user cash holdings across all components.

### 2. Market Data Store (`marketStore.js`)
Coordinates live asset prices:
*   **State Fields:**
    *   `assets` (Array): Tracks active, tradable assets.
    *   `loading` (Boolean): Sync indicator.
    *   `error` (String): Errors list.
*   **Actions:**
    *   `fetchAssets()` (Async): Hits `/api/market/assets` to pull database baselines during app load.
    *   `setAssets(updatedAssets)`: Integrates WebSocket price feeds to update UI values instantly.

### 3. News and Sentiment Store (`newsStore.js`)
Manages market sentiment analysis:
*   **State Fields:**
    *   `feed` (Array): Financial articles catalog.
    *   `sentiment` (Object): Evaluated market sentiment (bullish, bearish, neutral).
    *   `unreadCount` (Number): Displays notifications for articles published after the trader's last-seen marker.
    *   `lastSeen` (Number): Timestamp tracking news views.
*   **Actions:**
    *   `fetchNews()` (Async): Pulls the latest news articles and sentiment calculations from the backend.
    *   `markAllRead()`: Saves the current timestamp to clear unread counts.
    *   `startPolling()`: Sets a 20-second background fetch loop.
    *   `stopPolling()`: Cleans up the background loop to save client bandwidth.

---

## Production Build and Deployment Guide

### Vite Production Bundling
To compile the frontend application for production deployment:
```bash
npm run build
```
This command runs the Vite compiler to create optimized, minified static files (HTML, CSS, JS) inside the `dist/` directory.

### Vercel Deployment Rewrites
To prevent React Router Single Page Application paths from throwing `404 Not Found` errors when users refresh their browsers on sub-routes (e.g., `/trader-dashboard/history`), configure a `vercel.json` rewrite file in the frontend root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Git Repository Cleanliness Utility
If environment parameters are tracked by git in error, run this clean-up sequence from your shell:
```bash
# Wipe out Git's cache tracking recursively
git rm -r --cached .

# Re-index files respecting all local .gitignore boundaries
git add .

# Lock in changes cleanly
git commit -m "chore: clear cached git index tracking and secure environment configurations"
```