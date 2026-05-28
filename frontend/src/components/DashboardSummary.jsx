import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";

export default function DashboardSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baseAPI.get("/api/trader/dashboard-summary")
      .then((res) => {
        setSummary(res.data?.payload || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Summary load failure:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Compiling Portfolio Balances...</div>;
  if (!summary) return <div className="text-center py-10 text-red-500">Failed to load account metrics.</div>;

  return (
    <div className="space-y-6">
      {/* Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Wallet</p>
          <p className="text-2xl font-mono font-bold mt-2 text-gray-800">${summary.walletBalance?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Invested Capital</p>
          <p className="text-2xl font-mono font-bold mt-2 text-gray-800">${summary.totalInvestedValue?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Holdings Value</p>
          <p className="text-2xl font-mono font-bold mt-2 text-gray-800">${summary.totalCurrentValue?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Net Return (P&L)</p>
          <p className={`text-2xl font-mono font-bold mt-2 ${summary.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            {summary.totalPnL >= 0 ? "+" : ""}${summary.totalPnL?.toLocaleString()} ({summary.totalPnLPercentage}%)
          </p>
        </div>
      </div>

      {/* Asset Allocations Breakdown Ledger */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-bold text-gray-700">Open Equity Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/70 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
              <th className="p-4">Asset</th>
              <th className="p-4">Shares Owned</th>
              <th className="p-4">Avg Buy Price</th>
              <th className="p-4">Current Spot Price</th>
              <th className="p-4">PnL Return</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono text-sm">
            {(summary.portfolioBreakdown || []).map((item) => (
              <tr key={item.assetId} className="hover:bg-gray-50/80">
                <td className="p-4 font-sans font-bold text-gray-800">{item.name} ({item.symbol})</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">${item.avgBuyPrice?.toLocaleString()}</td>
                <td className="p-4">${item.currentPrice?.toLocaleString()}</td>
                <td className={`p-4 font-bold ${item.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.pnl >= 0 ? "▲" : "▼"} ${item.pnl?.toLocaleString()} ({item.pnlPercentage}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}