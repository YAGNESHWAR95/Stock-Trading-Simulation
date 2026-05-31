import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";

export default function DashboardSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baseAPI.get("/api/trader/dashboard-summary")
      .then((res) => {
        setSummary(res.data?.payload || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Summary load failure:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Compiling platform telemetry and cash limits...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center border-rose-500/20 text-rose-500 py-12">
        <svg className="w-12 h-12 mx-auto text-rose-500/80 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-bold text-lg">Failed to restore account metrics.</p>
        <p className="text-sm text-[hsl(var(--text-muted))] mt-1">Please ensure your backend service connection is active.</p>
      </div>
    );
  }

  const isNetReturnPositive = summary.totalPnL >= 0;

  return (
    <div className="space-y-6">
      
      {/* Metric Glowing Scorecards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Scorecard: Available Wallet Balance */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Available Cash</span>
            <span className="text-2xl font-display font-extrabold text-[hsl(var(--text-main))] font-mono block">
              ${summary.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-emerald-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>

        {/* Scorecard: Invested Capital */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Invested Capital</span>
            <span className="text-2xl font-display font-extrabold text-[hsl(var(--text-main))] font-mono block">
              ${summary.totalInvestedValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/15 rounded-xl text-indigo-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        {/* Scorecard: Current Valuation */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Positions Valuation</span>
            <span className="text-2xl font-display font-extrabold text-[hsl(var(--text-main))] font-mono block">
              ${summary.totalCurrentValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/15 rounded-xl text-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        {/* Scorecard: Dynamic Profit & Loss Net Returns */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Net Return (P&L)</span>
            <span className={`text-2xl font-display font-extrabold font-mono block ${isNetReturnPositive ? "text-emerald-500 neon-text-green" : "text-rose-500 neon-text-red"}`}>
              {isNetReturnPositive ? "+" : ""}${summary.totalPnL?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-semibold ml-1.5 opacity-90">({summary.totalPnLPercentage?.toFixed(2)}%)</span>
            </span>
          </div>
          <div className={`p-3 rounded-xl border ${isNetReturnPositive ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-500" : "bg-rose-500/10 border-rose-500/15 text-rose-500"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isNetReturnPositive ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
              )}
            </svg>
          </div>
        </div>

      </div>

      {/* Asset Allocations Breakdown Table Container */}
      <div className="glass-panel rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* Table Title Panel */}
        <div className="px-6 py-5 border-b border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-base">Open Equity Positions</h3>
          </div>
          <span className="bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-[10px] text-indigo-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {summary.portfolioBreakdown?.length || 0} Assets Held
          </span>
        </div>

        {/* Custom Data Table Layout */}
        <div className="overflow-x-auto">
          {(!summary.portfolioBreakdown || summary.portfolioBreakdown.length === 0) ? (
            <div className="text-center py-16 space-y-3">
              <svg className="w-12 h-12 text-[hsl(var(--text-muted))]/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-[hsl(var(--text-muted))] font-semibold">Your portfolio is currently empty.</p>
              <p className="text-xs text-[hsl(var(--text-muted))]/80">Visit the live market feed to initiate your first simulated asset transaction.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[hsl(var(--color-tertiary))]/15 text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest border-b border-[var(--border-glass)]">
                  <th className="px-6 py-4">Asset Details</th>
                  <th className="px-6 py-4 text-right">Shares Owned</th>
                  <th className="px-6 py-4 text-right">Avg Cost Basis</th>
                  <th className="px-6 py-4 text-right">Current Spot</th>
                  <th className="px-6 py-4 text-right">Total Net Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-glass)] text-sm font-medium text-[hsl(var(--text-main))]">
                {summary.portfolioBreakdown.map((item) => {
                  const isPosPositive = item.pnl >= 0;
                  return (
                    <tr key={item.assetId} className="hover:bg-white/[0.02] transition duration-150">
                      
                      {/* Asset Symbol & Name */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">{item.symbol}</span>
                          <span className="text-xs text-[hsl(var(--text-muted))] font-normal">{item.name}</span>
                        </div>
                      </td>
                      
                      {/* Shares Quantity */}
                      <td className="px-6 py-4 text-right font-mono text-[hsl(var(--text-muted))]">
                        {item.quantity?.toLocaleString()}
                      </td>
                      
                      {/* Average purchase cost basis */}
                      <td className="px-6 py-4 text-right font-mono text-[hsl(var(--text-muted))]">
                        ${item.avgBuyPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      
                      {/* Current active price ticks */}
                      <td className="px-6 py-4 text-right font-mono text-[hsl(var(--text-main))]">
                        ${item.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      
                      {/* Interactive PnL Returns */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className={`font-mono font-bold text-sm ${isPosPositive ? "text-emerald-500" : "text-rose-500"}`}>
                            {isPosPositive ? "▲" : "▼"} ${Math.abs(item.pnl)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className={`text-[10px] font-bold ${isPosPositive ? "text-emerald-500/80" : "text-rose-500/80"}`}>
                            {isPosPositive ? "+" : ""}{item.pnlPercentage?.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
    </div>
  );
}