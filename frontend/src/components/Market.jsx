import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../store/marketStore";
import { useAuth } from "../store/authStore";
import { socket } from "./config/socket";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";
import LiveTicker from "./LiveTicker";

export default function Market() {
  const { assets, fetchAssets, loading, setAssets } = useMarket();
  const { isAuthenticated, currentUser } = useAuth();
  const [prevPrices, setPrevPrices] = useState({});
  const [ticks, setTicks] = useState({}); // Tracks price direction flash signals
  const [watchlist, setWatchlist] = useState([]);
  const [savingWatchId, setSavingWatchId] = useState(null);
  const [selectedCompare, setSelectedCompare] = useState([]);

  const loadWatchlist = useCallback(async () => {
    if (!isAuthenticated) return setWatchlist([]);

    try {
      const res = await baseAPI.get("/api/trader/watchlist");
      setWatchlist(res.data?.payload || []);
    } catch (err) {
      console.error("Failed to fetch watchlist", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAssets();

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("market-data-update", (updatedAssets) => {
      setPrevPrices((prev) => {
        const newPrev = { ...prev };
        
        // Track ticker fluctuation signals for price animation glows
        setTicks((currentTicks) => {
          const nextTicks = { ...currentTicks };
          updatedAssets.forEach((asset) => {
            const oldPrice = prev[asset._id];
            if (oldPrice !== undefined) {
              if (asset.currentPrice > oldPrice) {
                nextTicks[asset._id] = "up";
              } else if (asset.currentPrice < oldPrice) {
                nextTicks[asset._id] = "down";
              }
            }
          });
          return nextTicks;
        });

        updatedAssets.forEach((asset) => {
          newPrev[asset._id] = asset.currentPrice;
        });
        return newPrev;
      });
      setAssets(updatedAssets);
    });

    socket.on("price-alert-notification", ({ message }) => {
      toast.success(message || "Price alert triggered!");
    });

    socket.on("conditional-order-triggered", ({ message }) => {
      toast.success(message || "Conditional order executed.");
    });

    return () => {
      socket.off("market-data-update");
      socket.off("price-alert-notification");
      socket.off("conditional-order-triggered");
    };
  }, [fetchAssets, setAssets]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?._id) return;
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join-user-room", currentUser._id);
    loadWatchlist();
  }, [isAuthenticated, currentUser, loadWatchlist]);

  const handleToggleWatchlist = async (assetId) => {
    if (!isAuthenticated) {
      toast.error("Log in to manage your watchlist.");
      return;
    }

    try {
      setSavingWatchId(assetId);
      const exists = watchlist.some((item) => item._id === assetId);

      if (exists) {
        await baseAPI.delete(`/api/trader/watchlist/${assetId}`);
        setWatchlist((prev) => prev.filter((item) => item._id !== assetId));
        toast.success("Removed from watchlist.");
      } else {
        await baseAPI.post("/api/trader/watchlist", { assetId });
        const asset = assets.find((item) => item._id === assetId);
        if (asset) setWatchlist((prev) => [...prev, asset]);
        toast.success("Added to watchlist.");
      }
    } catch (err) {
      console.error("Watchlist update failed", err);
      toast.error("Could not update your watchlist.");
    } finally {
      setSavingWatchId(null);
    }
  };

  const toggleCompare = (assetId) => {
    setSelectedCompare((current) => {
      if (current.includes(assetId)) return current.filter((id) => id !== assetId);
      if (current.length >= 3) {
        toast.error("Compare up to 3 assets only.");
        return current;
      }
      return [...current, assetId];
    });
  };

  // Safe loading spinner layout
  if (loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-semibold text-sm">Synchronizing real-time market pipelines...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Live Ticker Banner */}
      <LiveTicker maxItems={12} />
      
      {/* Market Discovery Dashboard Header */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Live Exchange</span>
            <h1 className="text-2xl font-display font-black text-white leading-tight">Interactive Market Board</h1>
            <p className="text-xs text-slate-400">Monitor continuous pricing shifts and analyze overall asset dynamics.</p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 items-center">
            
            <div className="glass-panel bg-slate-900/30 text-xs font-bold text-slate-300 border border-white/5 rounded-xl px-4 py-3">
              Watchlist: {watchlist.length}
            </div>
            
            <div className="glass-panel bg-slate-900/30 text-xs font-bold text-slate-300 border border-white/5 rounded-xl px-4 py-3">
              Compare: {selectedCompare.length} / 3
            </div>

            {selectedCompare.length >= 2 && (
              <Link
                to={`/trader-dashboard/compare`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-3.5 rounded-xl transition duration-200"
              >
                Compare Assets
              </Link>
            )}

            <Link
              to="/ai"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition duration-200"
            >
              Consult AI
            </Link>
            
          </div>
        </div>
      </div>

      {/* Grid of Interactive Asset Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(assets || []).map((asset) => {
          const tickState = ticks[asset._id];
          const animationClass = tickState === "up" ? "animate-tick-up" : tickState === "down" ? "animate-tick-down" : "";
          const isUp = tickState === "up" || (prevPrices[asset._id] !== undefined && asset.currentPrice > prevPrices[asset._id]);
          const isDown = tickState === "down" || (prevPrices[asset._id] !== undefined && asset.currentPrice < prevPrices[asset._id]);

          return (
            <div
              key={asset._id}
              className="relative overflow-hidden glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between min-h-[220px] transition-all duration-300 shadow-lg"
            >
              {/* Real-time glow flash layer (keyed by price to re-render on updates) */}
              <div 
                key={`${asset._id}-${asset.currentPrice}`} 
                className={`absolute inset-0 pointer-events-none opacity-10 rounded-2xl ${animationClass}`} 
              />
              
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                
                {/* Symbol, Name and Badges */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <span className="font-display font-extrabold text-white text-lg block">{asset.symbol}</span>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block truncate max-w-[120px]">
                      {asset.name}
                    </span>
                  </div>
                  
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                    isUp 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" 
                      : isDown 
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/15" 
                      : "bg-slate-900 border border-white/5 text-slate-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isUp ? "bg-emerald-400 animate-pulse" : isDown ? "bg-rose-400 animate-pulse" : "bg-slate-400"}`} />
                    LIVE
                  </span>
                </div>

                {/* Main Dynamic Price Indicator */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Spot Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-mono font-extrabold tracking-tight transition-colors duration-300 ${
                      isUp ? "text-emerald-400 neon-text-green" : isDown ? "text-rose-400 neon-text-red" : "text-white"
                    }`}>
                      ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Interactive Action Menu Controls */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  
                  <button
                    type="button"
                    onClick={() => handleToggleWatchlist(asset._id)}
                    disabled={savingWatchId === asset._id}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition duration-200 cursor-pointer ${
                      watchlist.some((item) => item._id === asset._id)
                        ? "bg-slate-900 text-slate-200 border border-white/5 hover:bg-slate-800"
                        : "bg-indigo-600/15 text-indigo-400 border border-indigo-500/10 hover:bg-indigo-600/25"
                    } ${savingWatchId === asset._id ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {watchlist.some((item) => item._id === asset._id) ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      )}
                    </svg>
                    <span>{watchlist.some((item) => item._id === asset._id) ? "Tracked" : "Track"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCompare(asset._id)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition duration-200 cursor-pointer ${
                      selectedCompare.includes(asset._id)
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-slate-900 text-slate-400 border border-white/5 hover:bg-slate-800/80 hover:text-slate-300"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{selectedCompare.includes(asset._id) ? "Selected" : "Compare"}</span>
                  </button>

                  <Link
                    to={`/asset/${asset._id}`}
                    className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/20 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition duration-200"
                  >
                    <span>View Workspace</span>
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                </div>
                
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}