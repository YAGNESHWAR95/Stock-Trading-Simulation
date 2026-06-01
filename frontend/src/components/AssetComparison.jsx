import { useEffect, useMemo, useState } from "react";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

export default function AssetComparison() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        const res = await baseAPI.get("/api/market/assets");
        setAssets(res.data?.payload || res.data || []);
      } catch (err) {
        console.error("Asset comparison load failed", err);
        toast.error("Unable to load market assets.");
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  const toggleSelection = (assetId) => {
    setSelected((current) => {
      if (current.includes(assetId)) return current.filter((id) => id !== assetId);
      if (current.length >= 3) return current;
      return [...current, assetId];
    });
  };

  const selectedAssets = useMemo(
    () => assets.filter((asset) => selected.includes(asset._id)),
    [assets, selected]
  );

  if (loading) {
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
            {selected.length} / 3 Selected
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
            {assets.slice(0, 20).map((asset) => {
              const isSelected = selected.includes(asset._id);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                  {selectedAssets.map((asset) => (
                    <tr key={asset._id} className="hover:bg-white/[0.01] transition duration-150">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">{asset.symbol}</span>
                          <span className="text-[10px] text-[hsl(var(--text-muted))] font-normal">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-[hsl(var(--text-main))]">
                        ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

