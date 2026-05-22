import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./config/socket";

export default function DashboardSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); 
  const userId = localStorage.getItem("userId"); 

  const fetchSummary = async () => {
    try {
      // Corrected to route prefix /trader-api on port 4000
      const res = await axios.get("http://localhost:4000/trader-api/dashboard-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.payload);
      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard metrics");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();

    socket.connect();
    if (userId) {
      socket.emit("join-user-room", userId);
    }

    // Corrected to map exactly onto your server's "market-data-update" broadcast channel
    socket.on("market-data-update", (updatedAssetsArray) => {
      setSummary((prevSummary) => {
        if (!prevSummary) return prevSummary;

        let totalCurrentValue = 0;

        const updatedBreakdown = prevSummary.portfolioBreakdown.map((item) => {
          // Cross-reference asset updates streaming from your server loop array
          const liveAssetUpdate = updatedAssetsArray.find((a) => a._id === item.assetId);

          if (liveAssetUpdate) {
            const newCurrentValue = item.quantity * liveAssetUpdate.currentPrice;
            const newPnL = newCurrentValue - item.investedValue;
            const newPnLPercentage = item.investedValue > 0 ? (newPnL / item.investedValue) * 100 : 0;
            
            totalCurrentValue += newCurrentValue;

            return {
              ...item,
              currentPrice: liveAssetUpdate.currentPrice,
              currentValue: parseFloat(newCurrentValue.toFixed(2)),
              pnl: parseFloat(newPnL.toFixed(2)),
              pnlPercentage: parseFloat(newPnLPercentage.toFixed(2)),
            };
          }
          totalCurrentValue += item.currentValue;
          return item;
        });

        const totalPnL = totalCurrentValue - prevSummary.totalInvestedValue;
        const totalPnLPercentage = prevSummary.totalInvestedValue > 0 ? (totalPnL / prevSummary.totalInvestedValue) * 100 : 0;

        return {
          ...prevSummary,
          totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
          totalPnL: parseFloat(totalPnL.toFixed(2)),
          totalPnLPercentage: parseFloat(totalPnLPercentage.toFixed(2)),
          portfolioBreakdown: updatedBreakdown,
        };
      });
    });

    socket.on("price-alert-notification", (data) => {
      alert(`🔔 TRIGGERED ALERT: ${data.message}`);
    });

    return () => {
      socket.off("market-data-update");
      socket.off("price-alert-notification");
      socket.disconnect();
    };
  }, []);

  if (loading) return <div className="p-6 text-center text-xl">Recalculating Metrics...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Portfolio Dashboard</h1>

      {/* Cards Portfolio Metrics Breakdown Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border">
          <p className="text-gray-500 text-sm font-medium">Wallet Balance</p>
          <p className="text-2xl font-bold text-gray-900">${summary.walletBalance}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border">
          <p className="text-gray-500 text-sm font-medium">Total Invested</p>
          <p className="text-2xl font-bold text-gray-900">${summary.totalInvestedValue}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border">
          <p className="text-gray-500 text-sm font-medium">Current Valuation</p>
          <p className="text-2xl font-bold text-gray-900">${summary.totalCurrentValue}</p>
        </div>
        <div className={`p-4 rounded-xl shadow-md border ${summary.totalPnL >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className="text-gray-500 text-sm font-medium">Total Profit / Loss</p>
          <p className={`text-2xl font-bold ${summary.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            {summary.totalPnL >= 0 ? "+" : ""}${summary.totalPnL} ({summary.totalPnLPercentage}%)
          </p>
        </div>
      </div>

      {/* Holdings Breakdown Table */}
      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-lg text-gray-700">Your Asset Holdings Breakdowns</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 text-sm uppercase font-semibold">
              <th className="p-4">Asset</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Avg Cost</th>
              <th className="p-4">Live Price</th>
              <th className="p-4">Current Value</th>
              <th className="p-4">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {summary.portfolioBreakdown?.map((item) => (
              <tr key={item.assetId} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{item.assetName} <span className="text-gray-400 text-xs">({item.symbol})</span></td>
                <td className="p-4 text-gray-700">{item.quantity}</td>
                <td className="p-4 text-gray-700">${item.avgBuyPrice}</td>
                <td className="p-4 text-blue-600 font-semibold">${item.currentPrice}</td>
                <td className="p-4 text-gray-900 font-medium">${item.currentValue}</td>
                <td className={`p-4 font-bold ${item.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.pnl >= 0 ? "+" : ""}${item.pnl} ({item.pnlPercentage}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}