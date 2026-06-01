import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [marketAssets, setMarketAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states for creating a new alert condition rule
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState("ABOVE");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch active alerts and market choices simultaneously on layout mount
  const loadAlertsWorkspace = async () => {
    await Promise.resolve();
    try {
      setLoading(true);
      const [alertsRes, marketRes] = await Promise.all([
        baseAPI.get("/api/trader/alerts"),
        baseAPI.get("/api/market/assets") // Pulls tickers so you can pick from a dropdown list
      ]);

      setAlerts(alertsRes.data?.payload || []);
      
      const tokens = marketRes.data?.payload || marketRes.data || [];
      setMarketAssets(tokens);
      
      if (tokens.length > 0) {
        setSelectedAssetId(tokens[0]._id);
      }
    } catch (err) {
      console.error("Failed to load alerts telemetry context:", err);
      toast.error("Error connecting to monitoring feed rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsWorkspace();
  }, []);

  // 2. Handle creating a new watch rule condition
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !targetPrice) {
      toast.error("Please fill in all trigger parameters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await baseAPI.post("/api/trader/alerts", {
        assetId: selectedAssetId,
        targetPrice: Number(targetPrice),
        condition: condition
      });

      toast.success(res.data?.message || "Price monitoring rule locked in!");
      setTargetPrice("");
      
      // Reload list instantly to reveal the new data row entry
      await loadAlertsWorkspace();
    } catch (err) {
      console.error("Alert Creation Error:", err);
      toast.error(err.response?.data?.message || "Failed to compile monitoring trigger.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Syncing armed triggers and price targets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto transition-colors duration-300">
      
      {/* Interactive Form Panel to Create Rules */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
        
        <div className="mb-6">
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Custom Rules</span>
          <h3 className="text-lg font-display font-black text-[hsl(var(--text-main))] flex items-center gap-2">
            🔔 Configure Price Guard Rule
          </h3>
        </div>
        
        <form onSubmit={handleCreateAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Select Asset</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="premium-input w-full px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {marketAssets.map(asset => (
                <option key={asset._id} value={asset._id} className="bg-[hsl(var(--color-secondary))] text-[hsl(var(--text-main))]">
                  {asset.symbol} ({asset.name})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="premium-input w-full px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              <option value="ABOVE" className="text-emerald-500 bg-[hsl(var(--color-secondary))]">Goes ABOVE (▲)</option>
              <option value="BELOW" className="text-rose-500 bg-[hsl(var(--color-secondary))]">Drops BELOW (▼)</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Boundary ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 150.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="premium-input w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Arm Trigger"}
          </button>
        </form>
      </div>

      {/* Active Watch Rules Table Display */}
      <div className="glass-panel rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-base">Active Price Watch Rules</h3>
          </div>
          <span className="bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-[10px] text-indigo-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {alerts.length} Rules Armed
          </span>
        </div>
        
        <div className="divide-y divide-[var(--border-glass)]">
          {alerts.length === 0 ? (
            <p className="p-8 text-center text-xs text-[hsl(var(--text-muted))]">
              No active custom watch rules currently registered. Use the configuration panel above to arm a condition.
            </p>
          ) : (
            alerts.map((alert) => {
              const isAbove = alert.condition === "ABOVE";
              return (
                <div key={alert._id} className="px-6 py-4 flex justify-between items-center hover:bg-white/[0.01] transition-colors duration-150">
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">
                      {alert.asset?.name || "Asset"} <span className="text-indigo-400">({alert.asset?.symbol || "Unknown"})</span>
                    </span>
                    <div className="text-[10px] text-[hsl(var(--text-muted))] font-mono">
                      Current Price: ${alert.asset?.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                    </div>
                  </div>
                  
                  <div className="text-right font-mono text-sm flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider ${
                      isAbove 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15" 
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                    }`}>
                      IF PRICE {alert.condition}
                    </span>
                    <span className="font-extrabold text-[hsl(var(--text-main))] text-base">
                      ${alert.targetPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}