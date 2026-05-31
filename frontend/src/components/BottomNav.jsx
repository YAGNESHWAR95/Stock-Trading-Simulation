import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useNews } from "../store/newsStore";

const navItems = [
  { label: "Home", to: "/", icon: "🏠" },
  { label: "Market", to: "/market", icon: "📈" },
  { label: "Ask AI", to: "/ai", icon: "🤖" },
  { label: "News", to: "/trader-dashboard/news", icon: "📰" },
  { label: "Dashboard", to: "/trader-dashboard", icon: "📊" },
  { label: "Alerts", to: "/trader-dashboard/alerts", icon: "🔔" },
];

export default function BottomNav() {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  const activePath = (path) => {
    if (path === "/trader-dashboard" && location.pathname.startsWith("/trader-dashboard")) {
      return true;
    }
    return location.pathname === path;
  };

  const unreadCount = useNews((s) => s.unreadCount);

  const filteredNavItems = navItems;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-lg shadow-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
        {filteredNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`relative flex min-w-15 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition-all duration-200 ${
              activePath(item.to)
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:text-teal-700 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
            {item.label === 'News' && unreadCount > 0 && (
              <span className="absolute -top-1 right-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="flex min-w-15 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-all duration-200"
          >
            <span className="text-xl">🔐</span>
            <span>Login</span>
          </Link>
        )}

        {/* Unread badge for News */}
        {/* Positioning: find the News link element and overlay a small badge */}
      </div>
    </div>
  );
}
