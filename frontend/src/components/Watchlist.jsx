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

  if (loading) return <div className="text-center py-10">Loading your watchlist...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Watchlist</p>
            <h1 className="text-2xl font-semibold text-slate-900">Assets You’re Tracking</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {items.length} assets
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-lg font-semibold">Your watchlist is empty.</p>
          <p className="mt-2">Add assets from the market view to start tracking favorites.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((asset) => (
            <div key={asset._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{asset.symbol}</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">{asset.name}</h2>
                </div>
                <span className="text-lg font-bold text-slate-700">${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  to={`/asset/${asset._id}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  View Asset
                </Link>
                <button
                  type="button"
                  disabled={removing === asset._id}
                  onClick={() => handleRemove(asset._id)}
                  className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
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
