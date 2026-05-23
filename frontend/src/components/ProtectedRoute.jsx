import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isCheckingAuth } = useAuth();
  const location = useLocation();

  // 1. CRITICAL: If the store is still re-verifying the session, show a spinner 
  // instead of prematurely redirecting the user to /login!
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 font-medium text-gray-600">Restoring active session...</span>
      </div>
    );
  }

  // 2. If verification completes and no user is found, redirect to login
  if (!currentUser) {
    // Save the current path location so we can redirect back here post-login!
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role validation block
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}