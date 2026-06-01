import { useState } from "react";
import { useAuth } from "../store/authStore";
import baseAPI from "./config/baseAPI";

export default function TradeForm({ asset }) {
  const { currentUser, updateWalletBalance } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState("BUY");
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const estimatedCost = (asset?.currentPrice || 0) * (Number(quantity) || 0);

  const handleOrderSubmission = async (e) => {
    e.preventDefault();
    if (quantity <= 0) return;

    try {
      setProcessing(true);
      setFeedback({ type: "", text: "" });

      // FIX: Dynamically target your new endpoints from TraderAPI.js
      const targetEndpoint = action === "BUY" ? "/api/trader/buy" : "/api/trader/sell";

      const res = await baseAPI.post(targetEndpoint, {
        assetId: asset._id,
        quantity: Number(quantity),
      });

      // Update local global Zustand authentication store wallet status on success
      // Note: your new TraderAPI returns walletBalance at the top level of res.data
      const newBalance = res.data?.walletBalance !== undefined ? res.data.walletBalance : res.data?.payload?.walletBalance;
      
      if (updateWalletBalance && newBalance !== undefined) {
        updateWalletBalance(newBalance);
      }

      setFeedback({
        type: "success",
        text: res.data?.message || "Order executed successfully!",
      });
      setQuantity(1);
    } catch (err) {
      console.error("Order submission failure:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Transaction declined. Check limits.",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden transition-colors duration-300">
      
      {/* Title */}
      <div className="mb-4">
        <span className="text-[9px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block mb-0.5">Execution Workspace</span>
        <h3 className="text-lg font-display font-black text-[hsl(var(--text-main))]">Order Entry Panel</h3>
      </div>

      {/* Action Toggle Tabs */}
      <div className="grid grid-cols-2 gap-1 mb-6 bg-[hsl(var(--color-tertiary))]/50 p-1 rounded-xl border border-[var(--border-glass)]">
        <button
          type="button"
          onClick={() => setAction("BUY")}
          className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
            action === "BUY" 
              ? "bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:opacity-90" 
              : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))]/30"
          }`}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => setAction("SELL")}
          className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
            action === "SELL" 
              ? "bg-rose-500 text-white font-black shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:opacity-90" 
              : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] hover:bg-[hsl(var(--color-tertiary))]/30"
          }`}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleOrderSubmission} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">
            Order Quantity
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="premium-input w-full px-4 py-3 rounded-xl font-mono text-lg text-center"
          />
        </div>

        {/* Trade Metrics Overview */}
        <div className="bg-[hsl(var(--color-tertiary))]/60 p-4 rounded-xl border border-[var(--border-glass)] space-y-2 text-xs">
          <div className="flex justify-between items-center text-[hsl(var(--text-muted))]">
            <span>Available Balance:</span>
            <span className="font-mono font-bold text-[hsl(var(--text-main))]">
              ${currentUser?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-[hsl(var(--text-muted))] border-t pt-2 border-[var(--border-glass)]">
            <span>Estimated {action === "BUY" ? "Cost" : "Proceeds"}:</span>
            <span className={`font-mono font-extrabold ${action === "BUY" ? "text-emerald-500 neon-text-green" : "text-rose-500 neon-text-red"}`}>
              ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Transaction Feedback Messages */}
        {feedback.text && (
          <div
            className={`p-3 text-xs rounded-xl text-center font-bold border transition-all duration-300 ${
              feedback.type === "success" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all transform active:scale-95 shadow-md ${
            processing 
              ? "bg-[hsl(var(--color-tertiary))] text-[hsl(var(--text-muted))]/40 border border-[var(--border-glass)] cursor-not-allowed" 
              : action === "BUY" 
                ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer text-slate-950 font-black" 
                : "bg-rose-600 hover:bg-rose-700 hover:shadow-[0_0_15px_rgba(244,63,94,0.25)] cursor-pointer"
          }`}
        >
          {processing ? "Routing Order..." : `Transmit ${action} Order`}
        </button>
      </form>
    </div>
  );
}