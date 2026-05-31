import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function TraderDashboard() {
  const location = useLocation();

  // Helper helper to dynamically highlight the active navigation tab
  const isActiveTab = (path) => {
    if (path === "" && location.pathname === "/trader-dashboard") return true;
    return location.pathname === `/trader-dashboard/${path}`;
  };

  const navStyles = (path) =>
    `px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
      isActiveTab(path)
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Tab Header Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💼</span>
            <h2 className="text-xl font-bold text-gray-800">Trader Command Center</h2>
          </div>
          
          <nav className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <Link to="/trader-dashboard" className={navStyles("")}>
              Dashboard Summary
            </Link>
            <Link to="/trader-dashboard/history" className={navStyles("history")}>
              Trade History Logs
            </Link>
            <Link to="/trader-dashboard/leaderboard" className={navStyles("leaderboard")}>
              Leaderboard
            </Link>
            <Link to="/trader-dashboard/alerts" className={navStyles("alerts")}>
              Price Alerts
            </Link>
            <Link to="/trader-dashboard/news" className={navStyles("news")}>Market News</Link>
            <Link to="/trader-dashboard/ai" className={navStyles("ai")}>Ask AI</Link>
            <Link to="/market" className="px-4 py-2 font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100">
              Go to Live Market 📈
            </Link>
          </nav>
        </div>

        {/* Dynamic Outlet Window Viewport */}
        {/* React Router will inject the correct subcomponent here based on URL */}
        <div className="transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
}