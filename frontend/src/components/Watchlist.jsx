import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const loadWatchlist = async () => {
    await Promise.resolve();
    try {
      setLoading(true);
      const res = await baseAPI.get("/api/trader/watchlist");
      setItems(res.data?.payload || []);
    } catch (err) {
      console.error("Watchlist load failed", err);
      toast.error("Unable to load your watchlist right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleRemove = async (assetId) => {
    try {
      setRemoving(assetId);
      await baseAPI.delete(`/api/trader/watchlist/${assetId}`);
      toast.success("Removed from watchlist");
      await loadWatchlist();
    } catch (err) {
      console.error("Watchlist remove failed", err);
      toast.error("Could not remove that asset.");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Loading your custom watchlist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Live Tracking</span>
            <h1 className="text-2xl font-display font-black text-[hsl(var(--text-main))]">Your Custom Watchlist</h1>
          </div>
          <span className="rounded-full bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-xs font-mono font-bold text-[hsl(var(--text-muted))] px-4 py-2">
            {items.length} Assets Tracked
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-dashed border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 p-10 text-center text-[hsl(var(--text-muted))] space-y-2">
          <p className="text-lg font-display font-bold text-[hsl(var(--text-main))]">Your watchlist is empty.</p>
          <p className="text-xs">Add assets from the live market board view to start tracking favorites here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((asset) => (
            <div key={asset._id} className="glass-panel glass-panel-hover p-6 rounded-3xl border border-[var(--border-glass)] flex flex-col justify-between min-h-[180px] transition-all duration-300 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{asset.symbol}</p>
                  <h2 className="text-lg font-display font-black text-[hsl(var(--text-main))] tracking-tight truncate max-w-[150px]">{asset.name}</h2>
                </div>
                <span className="text-lg font-mono font-extrabold text-[hsl(var(--text-main))]">${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-glass)]">
                <Link
                  to={`/asset/${asset._id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[hsl(var(--color-tertiary))]/60 border border-[var(--border-glass)] hover:border-indigo-500/20 px-4 py-2.5 text-xs font-bold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))] transition duration-200"
                >
                  <span>Workspace</span>
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button
                  type="button"
                  disabled={removing === asset._id}
                  onClick={() => handleRemove(asset._id)}
                  className="bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/25 transition duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removing === asset._id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

