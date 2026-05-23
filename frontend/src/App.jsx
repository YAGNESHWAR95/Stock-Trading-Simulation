// import all the components and stuff
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./store/authStore"; // Adjust this path if your store folder is located somewhere else


// Layout & Utility Components
import RootLayout from "./components/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import ErrorBoundary from "./components/ErrorBoundary";

// Public/Auth Components
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

// Trading & Admin Components
import Market from "./components/Market";
import AssetByID from "./components/AssetByID";
import TraderDashboard from "./components/TraderDashboard";
import AdminDashboard from "./components/AdminDashboard";

// New Feature Extensions Components
import DashboardSummary from "./components/DashboardSummary";
import TradingHistory from "./components/TradingHistory";
import Leaderboard from "./components/Leaderboard";
import PriceAlerts from "./components/PriceAlerts";

// main app function
function App() {
  const { checkAuth } = useAuth();

  // Trigger the authentication verify check as soon as the React app mounts/refreshes
  useEffect(() => {
    if (checkAuth) {
      checkAuth();
    }
  }, [checkAuth]);

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
          path: "market",
          element: (
            <ProtectedRoute allowedRoles={["TRADER", "ADMIN"]}>
              <Market />
            </ProtectedRoute>
          ),
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
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;