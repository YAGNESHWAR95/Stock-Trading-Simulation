import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { socket } from "./config/socket";

export default function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Initial state check
    setIsSocketConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/70 border-b border-white/5 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Brand Gradient Logo */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="text-2xl font-display font-black tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent hover:opacity-90 transition duration-300"
          >
            TradePro
          </Link>
          
          {/* Socket.io Connectivity status indicator lamp */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/5 rounded-full px-2.5 py-1 text-[11px] font-medium text-slate-400">
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSocketConnected ? "bg-emerald-400" : "bg-rose-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSocketConnected ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            </span>
            <span>{isSocketConnected ? "Live Feed" : "Offline"}</span>
          </div>
        </div>

        {/* Global Responsive Navigation Bar Links */}
        <nav className="flex items-center gap-6">
          <Link to="/market" className="text-sm font-semibold text-slate-300 hover:text-white transition duration-200">
            Market
          </Link>
          <Link to="/ai" className="text-sm font-semibold text-slate-300 hover:text-white transition duration-200">
            Ask AI
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
              
              {/* Role-based Dashboard Access Button */}
              {currentUser?.role === "ADMIN" ? (
                <Link 
                  to="/admin-dashboard" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition duration-200"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link 
                  to="/trader-dashboard" 
                  className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/35 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition duration-200"
                >
                  Dashboard
                </Link>
              )}
              
              {/* User identity & dynamic balances */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-slate-400 font-medium">Trader</span>
                <span className="text-sm font-bold text-white leading-tight">{currentUser?.firstName}</span>
              </div>

              <button 
                onClick={handleLogout} 
                className="bg-slate-900 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/25 transition duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition duration-200">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}