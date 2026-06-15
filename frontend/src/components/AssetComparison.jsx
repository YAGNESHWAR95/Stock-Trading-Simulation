import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMarket } from "../store/marketStore";
import { socket } from "./config/socket";
import { toast } from "react-hot-toast";

export default function AssetComparison() {
  const { assets, fetchAssets, loading, setAssets, selectedCompare, setSelectedCompare } = useMarket();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prevPrices, setPrevPrices] = useState({});
  const [ticks, setTicks] = useState({}); // Tracks price direction flash signals

  // Sync initial and query param changes to selectedCompare in store
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    const urlIds = idsParam ? idsParam.split(",").filter(Boolean) : [];
    const currentIds = selectedCompare || [];

    const isDifferent = currentIds.length !== urlIds.length ||
      currentIds.some((id, idx) => id !== urlIds[idx]);

    if (isDifferent) {
      setSelectedCompare(urlIds);
    }
  }, [searchParams, selectedCompare, setSelectedCompare]);

  // Fetch initial assets and listen for live updates
  useEffect(() => {
    fetchAssets();

    if (!socket.connected) {
      socket.connect();
    }

    const handleMarketUpdate = (updatedAssets) => {
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
    };

    socket.on("market-data-update", handleMarketUpdate);

    return () => {
      socket.off("market-data-update", handleMarketUpdate);
    };
  }, [fetchAssets, setAssets]);

  const toggleSelection = (assetId) => {
    let next;
    if (selectedCompare.includes(assetId)) {
      next = selectedCompare.filter((id) => id !== assetId);
    } else {
      if (selectedCompare.length >= 3) {
        toast.error("Compare up to 3 assets only.");
        return;
      }
      next = [...selectedCompare, assetId];
    }
    setSearchParams({ ids: next.join(",") });
  };

  const selectedAssets = useMemo(
    () => assets.filter((asset) => selectedCompare.includes(asset._id)),
    [assets, selectedCompare]
  );

  if (loading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Preparing comparative metrics desk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Comparative Desk</span>
            <h1 className="text-2xl font-display font-black text-[hsl(var(--text-main))]">Asset Comparison Workspace</h1>
          </div>
          <span className="rounded-full bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-xs font-mono font-bold text-[hsl(var(--text-muted))] px-4 py-2">
            {selectedCompare.length} / 3 Selected
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Market Asset Selection List */}
        <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden flex flex-col">
          <div className="mb-4">
            <span className="text-[9px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block mb-0.5">Asset Registry</span>
            <h2 className="text-lg font-display font-black text-[hsl(var(--text-main))]">Available Exchange Assets</h2>
          </div>
          <div className="mt-2 grid gap-3 max-h-[420px] overflow-y-auto pr-2 hide-scrollbar">
            {assets.map((asset) => {
              const isSelected = selectedCompare.includes(asset._id);
              return (
                <button
                  key={asset._id}
                  type="button"
                  onClick={() => toggleSelection(asset._id)}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-emerald-500/30 bg-emerald-500/[0.04] shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                      : "border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 hover:border-indigo-500/20 hover:bg-[hsl(var(--color-tertiary))]/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{asset.symbol}</p>
                      <h3 className="text-sm font-display font-bold text-[hsl(var(--text-main))]">{asset.name}</h3>
                    </div>
                    <span className="text-sm font-mono font-extrabold text-[hsl(var(--text-main))]">
                      ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Table Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden flex flex-col">
          <div className="mb-4">
            <span className="text-[9px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block mb-0.5">Comparison Output</span>
            <h2 className="text-lg font-display font-black text-[hsl(var(--text-main))]">Comparative Telemetry</h2>
          </div>

          {selectedAssets.length === 0 ? (
            <div className="grow flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 p-8 text-center text-[hsl(var(--text-muted))] mt-2 space-y-2">
              <svg className="w-10 h-10 text-[hsl(var(--text-muted))]/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-semibold text-[hsl(var(--text-main))]">No assets compared yet.</p>
              <p className="text-xs">Select up to 3 assets from the registry panel to compare real-time metrics side-by-side.</p>
            </div>
          ) : (
            <div className="mt-2 overflow-x-auto grow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[hsl(var(--color-tertiary))]/15 text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest border-b border-[var(--border-glass)]">
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Market Cap</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-glass)] text-sm font-medium text-[hsl(var(--text-main))]">
                  {selectedAssets.map((asset) => {
                    const tickState = ticks[asset._id];
                    const isUp = tickState === "up" || (prevPrices[asset._id] !== undefined && asset.currentPrice > prevPrices[asset._id]);
                    const isDown = tickState === "down" || (prevPrices[asset._id] !== undefined && asset.currentPrice < prevPrices[asset._id]);

                    return (
                      <tr key={asset._id} className="hover:bg-white/[0.01] transition duration-150">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">{asset.symbol}</span>
                            <span className="text-[10px] text-[hsl(var(--text-muted))] font-normal">{asset.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-mono">
                          <span className={`transition-colors duration-300 font-extrabold ${
                            isUp ? "text-emerald-500 neon-text-green" : isDown ? "text-rose-500 neon-text-red" : "text-[hsl(var(--text-main))]"
                          }`}>
                            ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-mono text-[hsl(var(--text-muted))] text-xs">
                          ${(asset.marketCap || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                            asset.isActive 
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15" 
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                          }`}>
                            {asset.isActive ? "ACTIVE" : "HALTED"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

