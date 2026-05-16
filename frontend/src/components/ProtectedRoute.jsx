import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}