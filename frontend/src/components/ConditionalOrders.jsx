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

  if (loading) return <div className="text-center py-10">Loading conditional orders...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Conditional Trading</p>
            <h1 className="text-2xl font-semibold text-slate-900">Stop Loss & Take Profit</h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-2xl bg-slate-100 px-3 py-2">Active rules: {summary.total}</span>
            <span className="rounded-2xl bg-emerald-100 px-3 py-2">Profit targets: {summary.profitOrders}</span>
            <span className="rounded-2xl bg-rose-100 px-3 py-2">Stop losses: {summary.stopLossOrders}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
            >
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.symbol} — {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Trigger Type</label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
            >
              {triggerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Target Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-700">Build your exit strategy.</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">Conditional orders automatically sell your holdings when the market crosses your trigger price.</p>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Saving rule..." : "Create Conditional Order"}
          </button>
        </div>
      </form>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Active Conditional Orders</h2>
        <div className="mt-4 space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
              No active conditional orders yet. Create one from the panel above.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="rounded-3xl border border-slate-200 p-4 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{order.asset?.symbol} — {order.asset?.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{order.triggerType.replace("_", " ")}</p>
                  <p className="mt-1 text-sm text-slate-600">Quantity: {order.quantity} · Target: ${order.triggerPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="mt-4 inline-flex rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
