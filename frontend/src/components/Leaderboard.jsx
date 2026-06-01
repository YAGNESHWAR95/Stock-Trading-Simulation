import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";

export default function Leaderboard() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baseAPI.get("/api/trader/leaderboard")
      .then((res) => {
        setTraders(res.data?.payload || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Leaderboard compilation failure:", err);
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
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Ranking global simulation standings...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto transition-colors duration-300">
      
      {/* Title Panel */}
      <div className="px-6 py-5 border-b border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 text-center space-y-1">
        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Active Standings</span>
        <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-lg">Top Active Traders (Net Worth Tier)</h3>
      </div>

      <div className="divide-y divide-[var(--border-glass)]">
        {traders.length === 0 ? (
          <p className="p-8 text-center text-sm text-[hsl(var(--text-muted))]">No trader statistics compiled yet.</p>
        ) : (
          traders.map((trader, idx) => {
            const isTopThree = idx < 3;
            const rankBadgeClass = 
              idx === 0 
                ? "bg-amber-400/20 text-amber-400 border border-amber-400/30" 
                : idx === 1 
                ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" 
                : idx === 2 
                ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" 
                : "bg-[hsl(var(--color-tertiary))] text-[hsl(var(--text-muted))] border border-[var(--border-glass)]";

            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between px-6 py-4 transition duration-200 ${
                  idx === 0 ? "bg-amber-500/[0.02]" : "hover:bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <span className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black font-mono ${rankBadgeClass}`}>
                    {idx + 1}
                  </span>
                  
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">
                      {trader.username}
                    </span>
                    {idx === 0 && (
                      <span className="text-[8px] font-bold text-amber-400 uppercase tracking-widest leading-none mt-0.5">🏆 Exchange Leader</span>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="font-mono font-bold text-[hsl(var(--text-main))] text-sm">
                    ${trader.totalNetWorth?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-[hsl(var(--text-muted))] font-mono">
                    Free Cash: ${trader.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}