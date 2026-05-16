// import all the components and stuff
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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

// main app function
function App() {
  // create the router
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "",
          element: <Home />, // Or you can change this to render <Market /> directly
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