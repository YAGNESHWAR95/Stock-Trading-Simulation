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
  const [watchlist, setWatchlist] = useState([]);
  const [savingWatchId, setSavingWatchId] = useState(null);
  const [selectedCompare, setSelectedCompare] = useState([]);

  const loadWatchlist = useCallback(async () => {
    await Promise.resolve();
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



  // safer loading check
  if (loading && assets.length === 0) {
    return (
      <div className="text-center py-10">
        Loading Market Data...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <LiveTicker maxItems={12} />
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Live Market</p>
            <h1 className="text-3xl font-bold text-slate-900">Explore the latest asset momentum</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Watchlist: {watchlist.length} asset{watchlist.length === 1 ? "" : "s"}
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Compare: {selectedCompare.length} / 3
            </div>
            <Link
              to="/ai"
              className="rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-6 overflow-x-auto md:grid-flow-row md:grid-cols-3 lg:grid-cols-4 md:auto-cols-auto snap-x snap-mandatory hide-scrollbar py-2">
        {(assets || []).map((asset) => {
          const prevPrice = prevPrices[asset._id];

          const isUp =
            prevPrice !== undefined && asset.currentPrice > prevPrice;
          const isDown =
            prevPrice !== undefined && asset.currentPrice < prevPrice;

          return (
            <div
              key={asset._id}
              className="bg-white p-5 rounded-xl shadow border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{asset.symbol}</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    {asset.name}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    isUp
                      ? "bg-green-100 text-green-700"
                      : isDown
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isUp ? "▲" : isDown ? "▼" : "●"} LIVE
                </span>
              </div>

              <div className="mt-4">
                <p
                  className={`text-2xl font-mono font-bold ${
                    isUp
                      ? "text-green-500"
                      : isDown
                      ? "text-red-500"
                      : "text-gray-800"
                  }`}
                >
                  $
                  {asset.currentPrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleWatchlist(asset._id)}
                  disabled={savingWatchId === asset._id}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold ${watchlist.some((item) => item._id === asset._id) ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-teal-600 text-white hover:bg-teal-700"} ${savingWatchId === asset._id ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {savingWatchId === asset._id ? "Updating..." : watchlist.some((item) => item._id === asset._id) ? "Saved" : "Track"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(asset._id)}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold ${selectedCompare.includes(asset._id) ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {selectedCompare.includes(asset._id) ? "Selected" : "Compare"}
                </button>
                <Link
                  to={`/asset/${asset._id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}