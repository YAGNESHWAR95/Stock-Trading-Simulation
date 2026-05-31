import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-400 tracking-wide">
          TradePro
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center gap-3 justify-end">
          <Link to="/market" className="hover:text-green-400 transition">Market</Link>

          {isAuthenticated ? (
            <>
              {/* Role-based Dashboard Link */}
              {currentUser?.role === "ADMIN" ? (
                <Link to="/admin-dashboard" className="hover:text-green-400 transition">Admin Panel</Link>
              ) : (
                <>
                  <Link to="/trader-dashboard" className="hover:text-green-400 transition">Dashboard</Link>
                  <Link to="/trader-dashboard/ai" className="hover:text-green-400 transition">Ask AI</Link>
                </>
              )}
              
              {/* User Info & Logout */}
              <div className="flex items-center gap-4 ml-4 border-l border-gray-700 pl-4">
                <span className="text-sm text-gray-300">
                  Welcome, <b className="text-white">{currentUser?.firstName}</b>
                </span>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-600 px-4 py-1.5 rounded text-sm font-semibold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest Links */}
              <Link to="/login" className="hover:text-green-400 transition">Login</Link>
              <Link to="/register" className="bg-green-600 px-4 py-1.5 rounded text-sm font-semibold hover:bg-green-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}