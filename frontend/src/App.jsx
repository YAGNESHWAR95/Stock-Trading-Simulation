// import all the components and stuff
import { useEffect, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./store/authStore";
import { useTheme } from "./store/themeStore";

// Layout & Utility Components
import RootLayout from "./components/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import ErrorBoundary from "./components/ErrorBoundary";
import SleekLoader from "./components/SleekLoader";

// Lazy Loaded Public/Auth Components
const Home = lazy(() => import("./components/Home"));
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));

// Lazy Loaded Trading & Admin Components
const Market = lazy(() => import("./components/Market"));
const AssetByID = lazy(() => import("./components/AssetByID"));
const TraderDashboard = lazy(() => import("./components/TraderDashboard"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

// Lazy Loaded New Feature Extensions Components
const DashboardSummary = lazy(() => import("./components/DashboardSummary"));
const TradingHistory = lazy(() => import("./components/TradingHistory"));
const Leaderboard = lazy(() => import("./components/Leaderboard"));
const PriceAlerts = lazy(() => import("./components/PriceAlerts"));
const MarketNews = lazy(() => import("./components/MarketNews"));
const AiDoubts = lazy(() => import("./components/AiDoubts"));

// main app function
function App() {
  const { checkAuth } = useAuth();
  const { initTheme } = useTheme();

  // Initialize active theme parameters and check user auth session on load
  useEffect(() => {
    if (initTheme) initTheme();
    if (checkAuth) checkAuth();
  }, [checkAuth, initTheme]);

  // create the router
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "market",
          element: (
            <ProtectedRoute allowedRoles={["TRADER", "ADMIN"]}>
              <Market />
            </ProtectedRoute>
          ),
        },
        {
          path: "ai",
          element: <AiDoubts />,
        },
        {
          path: "asset/:id",
          element: (
            <ProtectedRoute allowedRoles={["TRADER", "ADMIN"]}>
              <AssetByID />
            </ProtectedRoute>
          ),
        },
        {
          path: "trader-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["TRADER"]}>
              <TraderDashboard />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "", // Default view when landing on /trader-dashboard
              element: <DashboardSummary />,
            },
            {
              path: "history", // /trader-dashboard/history
              element: <TradingHistory />,
            },
            {
              path: "leaderboard", // /trader-dashboard/leaderboard
              element: <Leaderboard />,
            },
            {
              path: "alerts", // /trader-dashboard/alerts
              element: <PriceAlerts />,
            },
            {
              path: "news", // /trader-dashboard/news
              element: <MarketNews />,
            },
            {
              path: "ai", // /trader-dashboard/ai
              element: <AiDoubts />,
            },
          ],
        },
        {
          path: "admin-dashboard",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
       
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },
      ],
    },
  ]);

  // return the app with toaster and router
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<SleekLoader />}>
        <RouterProvider router={routerObj} />
      </Suspense>
    </>
  );
}

export default App;