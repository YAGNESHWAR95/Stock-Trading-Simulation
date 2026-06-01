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
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const activePath = (path) => {
    if (path === "/trader-dashboard" && location.pathname.startsWith("/trader-dashboard")) {
      return true;
    }
    return location.pathname === path;
  };

  const unreadCount = useNews((s) => s.unreadCount);

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 glass-panel border-t border-[var(--border-glass)] shadow-xl transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`relative flex min-w-15 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              activePath(item.to)
                ? "bg-[hsl(var(--color-accent-teal))]/10 text-[hsl(var(--color-accent-teal))] border border-[hsl(var(--color-accent-teal))]/20 shadow-[0_0_8px_rgba(20,184,166,0.1)]"
                : "text-[hsl(var(--text-muted))] border border-transparent hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))]/50"
            }`}
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
            {item.label === 'News' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-black leading-none text-white bg-rose-500 rounded-full animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        ))}
        {!isAuthenticated && (
          <Link
            to="/login"
            className="flex min-w-15 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--text-muted))] border border-transparent hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))]/50 transition-all duration-200"
          >
            <span className="text-lg mb-0.5">🔐</span>
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}

