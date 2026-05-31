import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useTheme } from "../store/themeStore";
import { socket } from "./config/socket";

export default function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

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
    <header className="sticky top-0 z-50 w-full glass-panel shadow-lg transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Brand Gradient Logo */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="text-2xl font-display font-black tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent hover:opacity-90 transition duration-300"
          >
            TradePro
          </Link>
          
          {/* Socket.io Connectivity Status indicator */}
          <div className="flex items-center gap-1.5 bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] rounded-full px-2.5 py-1 text-[10px] font-medium text-[hsl(var(--text-muted))] transition duration-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSocketConnected ? "bg-emerald-400" : "bg-rose-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSocketConnected ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            </span>
            <span>{isSocketConnected ? "Live Feed" : "Offline"}</span>
          </div>
        </div>

        {/* Navigation & Theme Toggle */}
        <nav className="flex items-center gap-6">
          <Link to="/market" className="text-sm font-semibold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition duration-200">
            Market
          </Link>
          <Link to="/ai" className="text-sm font-semibold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition duration-200">
            Ask AI
          </Link>

          {/* Premium Light/Dark Theme Switcher Button */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-xl bg-[hsl(var(--color-tertiary))] hover:bg-[hsl(var(--color-tertiary))]/80 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] border border-[var(--border-glass)] hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              /* Sun Icon indicating option to shift to light */
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636 9 9 0 0118.364 18.364z" />
              </svg>
            ) : (
              /* Moon Icon indicating option to shift to dark */
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-[var(--border-glass)] pl-4">
              
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
                  className="bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition duration-200"
                >
                  Dashboard
                </Link>
              )}
              
              {/* User identity info */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-[hsl(var(--text-muted))] font-bold uppercase tracking-wider leading-none mb-0.5">Trader</span>
                <span className="text-sm font-bold text-[hsl(var(--text-main))] leading-tight">{currentUser?.firstName}</span>
              </div>

              <button 
                onClick={handleLogout} 
                className="bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/25 transition duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition duration-200">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-[1.02] transition duration-200"
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