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
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Execution Panel</h3>

      {/* Action Toggle Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setAction("BUY")}
          className={`py-2 text-sm font-bold rounded-md transition-all ${
            action === "BUY" ? "bg-green-600 text-white shadow" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          BUY
        </button>
        <button
          type="button"
          onClick={() => setAction("SELL")}
          className={`py-2 text-sm font-bold rounded-md transition-all ${
            action === "SELL" ? "bg-red-600 text-white shadow" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleOrderSubmission} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Order Quantity
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-2.5 font-mono text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Trade Metrics Overview */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Available Wallet Balance:</span>
            <span className="font-mono font-bold text-gray-800">
              ${currentUser?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 border-t pt-2 border-gray-200">
            <span>Estimated {action === "BUY" ? "Cost" : "Proceeds"}:</span>
            <span className={`font-mono font-bold ${action === "BUY" ? "text-green-600" : "text-red-600"}`}>
              ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Transaction Feedback Messages */}
        {feedback.text && (
          <div
            className={`p-3 text-sm rounded-lg text-center font-semibold ${
              feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-98 shadow-md ${
            processing ? "bg-gray-400 cursor-not-allowed" : action === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {processing ? "Routing Order..." : `Transmit ${action} Order`}
        </button>
      </form>
    </div>
  );
}