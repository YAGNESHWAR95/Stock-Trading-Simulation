import { Link, Outlet, useLocation } from "react-router-dom";

export default function TraderDashboard() {
  const location = useLocation();

  const isActiveTab = (path) => {
    if (path === "" && location.pathname === "/trader-dashboard") return true;
    return location.pathname === `/trader-dashboard/${path}`;
  };

  const navStyles = (path) =>
    `inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-200 cursor-pointer ${
      isActiveTab(path)
        ? "bg-[hsl(var(--color-accent-indigo))]/10 text-[hsl(var(--color-accent-indigo))] border-[hsl(var(--color-accent-indigo))]/30 shadow-[0_0_12px_rgba(99,102,241,0.1)]"
        : "bg-[hsl(var(--color-tertiary))]/40 text-[hsl(var(--text-muted))] border-[var(--border-glass)] hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))]/60"
    }`;

  return (
    <div className="space-y-6">
      
      {/* Segmented Navigation Tab Header Bar */}
      <div className="glass-panel p-4 rounded-2xl shadow-xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-colors duration-300">
        
        {/* Dashboard Title & Icon */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[hsl(var(--color-accent-indigo))]/15 border border-[hsl(var(--color-accent-indigo))]/20">
            <svg className="w-6 h-6 text-[hsl(var(--color-accent-indigo))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-display font-extrabold text-[hsl(var(--text-main))] leading-tight">Trader Command</h2>
            <p className="text-[10px] text-[hsl(var(--text-muted))] font-bold uppercase tracking-widest">Simulation Workspace</p>
          </div>
        </div>
        
        {/* Segmented Navigation Actions */}
        <nav className="flex flex-wrap gap-2 items-center justify-center lg:justify-end">
          
          <Link to="/trader-dashboard" className={navStyles("")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Overview</span>
          </Link>
          
          <Link to="/trader-dashboard/history" className={navStyles("history")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Audit History</span>
          </Link>
          
          <Link to="/trader-dashboard/leaderboard" className={navStyles("leaderboard")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Leaderboard</span>
          </Link>
          
          <Link to="/trader-dashboard/alerts" className={navStyles("alerts")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Alert Rules</span>
          </Link>
          
          <Link to="/trader-dashboard/news" className={navStyles("news")}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m2 2v10a2 2 0 01-2 2h-2" />
            </svg>
            <span>Market News</span>
          </Link>

          {/* Glowing CTA for Live Market Discovery */}
          <Link 
            to="/market" 
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-[hsl(var(--color-accent-teal))]/10 text-[hsl(var(--color-accent-teal))] border border-[hsl(var(--color-accent-teal))]/20 hover:bg-[hsl(var(--color-accent-teal))]/20 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
          >
            <span>Live Feed</span>
            <svg className="w-4 h-4 text-[hsl(var(--color-accent-teal))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </Link>
          
        </nav>
      </div>

      {/* Dynamic Subcomponent Outlet Panel */}
      <div className="transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
}