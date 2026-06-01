import { useEffect, useMemo, useState } from "react";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

const triggerOptions = [
  { value: "TAKE_PROFIT", label: "Take Profit (Sell Above)" },
  { value: "STOP_LOSS", label: "Stop Loss (Sell Below)" }
];

export default function ConditionalOrders() {
  const [assets, setAssets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [triggerType, setTriggerType] = useState("TAKE_PROFIT");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refreshData = async () => {
    await Promise.resolve();
    try {
      setLoading(true);
      const [assetsRes, ordersRes] = await Promise.all([
        baseAPI.get("/api/market/assets"),
        baseAPI.get("/api/trader/conditional-orders")
      ]);

      setAssets(assetsRes.data?.payload || assetsRes.data || []);
      setOrders(ordersRes.data?.payload || []);
      if (!selectedAsset && assetsRes.data?.payload?.length > 0) {
        setSelectedAsset(assetsRes.data.payload[0]._id);
      }
    } catch (err) {
      console.error("Conditional orders load failed", err);
      toast.error("Could not load conditional orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset || !triggerPrice || !quantity) {
      toast.error("Please complete all conditional order fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await baseAPI.post("/api/trader/conditional-orders", {
        assetId: selectedAsset,
        quantity: Number(quantity),
        triggerPrice: Number(triggerPrice),
        triggerType
      });
      toast.success(res.data?.message || "Conditional order created.");
      setTriggerPrice("");
      setQuantity(1);
      await refreshData();
    } catch (err) {
      console.error("Create conditional order failed", err);
      toast.error(err.response?.data?.message || "Unable to create conditional order.");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await baseAPI.delete(`/api/trader/conditional-orders/${id}`);
      toast.success("Conditional order cancelled.");
      await refreshData();
    } catch (err) {
      console.error("Cancel failed", err);
      toast.error("Could not cancel this order.");
    }
  };

  const summary = useMemo(() => ({
    total: orders.length,
    profitOrders: orders.filter((order) => order.triggerType === "TAKE_PROFIT").length,
    stopLossOrders: orders.filter((order) => order.triggerType === "STOP_LOSS").length,
  }), [orders]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Syncing conditional exit parameters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Automated Executions</span>
            <h1 className="text-2xl font-display font-black text-[hsl(var(--text-main))]">Stop Loss & Take Profit</h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold font-mono">
            <span className="rounded-full bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-[hsl(var(--text-muted))] px-3 py-1.5">
              Active: {summary.total}
            </span>
            <span className="rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-3 py-1.5">
              Targets: {summary.profitOrders}
            </span>
            <span className="rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/15 px-3 py-1.5">
              Losses: {summary.stopLossOrders}
            </span>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-[var(--border-glass)] glass-panel p-6 sm:p-8 shadow-xl sm:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="premium-input w-full px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id} className="bg-[hsl(var(--color-secondary))] text-[hsl(var(--text-main))]">
                  {asset.symbol} ({asset.name})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Trigger Type</label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="premium-input w-full px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              {triggerOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[hsl(var(--color-secondary))] text-[hsl(var(--text-main))]">{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="premium-input w-full px-4 py-2.5 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Target Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(e.target.value)}
                className="premium-input w-full px-4 py-2.5 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[hsl(var(--color-tertiary))]/60 border border-[var(--border-glass)] p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-xs font-display font-extrabold text-[hsl(var(--text-main))] uppercase tracking-wider">Exit Strategy Rules</p>
            <p className="text-xs leading-relaxed text-[hsl(var(--text-muted))]">
              Conditional orders will automatically liquidate your holdings on the exchange when the live spot price crosses your designated target price.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving rule..." : "Create Trigger"}
          </button>
        </div>
      </form>

      {/* Active Conditional Orders */}
      <div className="glass-panel rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30">
          <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-base">Armed Conditional Guards</h3>
        </div>
        
        <div className="divide-y divide-[var(--border-glass)]">
          {orders.length === 0 ? (
            <p className="p-8 text-center text-xs text-[hsl(var(--text-muted))]">
              No active conditional orders yet. Create one from the configuration panel above.
            </p>
          ) : (
            orders.map((order) => {
              const isProfit = order.triggerType === "TAKE_PROFIT";
              return (
                <div key={order._id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/[0.01] transition duration-150">
                  <div className="space-y-1">
                    <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">
                      {order.asset?.name} <span className="text-indigo-400 font-extrabold">({order.asset?.symbol})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        isProfit 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15" 
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                      }`}>
                        {order.triggerType.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-[hsl(var(--text-muted))] font-mono">
                        Shares: {order.quantity} · Target Spot: ${order.triggerPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/25 transition duration-200 cursor-pointer self-start sm:self-center"
                  >
                    Cancel Guard
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
