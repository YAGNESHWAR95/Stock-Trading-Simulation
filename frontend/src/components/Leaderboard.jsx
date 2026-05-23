import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";

export default function Leaderboard() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baseAPI.get("/api/trader/leaderboard")
      .then((res) => {
        setTraders(res.data?.payload || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Leaderboard compilation failure:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Ranking Global Standings...</div>;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden max-w-3xl mx-auto">
      <div className="p-4 border-b bg-gray-50 text-center">
        <h3 className="font-bold text-gray-700 text-lg">Top Active Traders (Net Worth Tier)</h3>
      </div>
      <div className="divide-y">
        {traders.map((trader, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                idx === 0 ? "bg-yellow-100 text-yellow-700 text-sm" : idx === 1 ? "bg-gray-200 text-gray-700" : idx === 2 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-400"
              }`}>
                {idx + 1}
              </span>
              <span className="font-bold text-gray-800">{trader.username}</span>
            </div>
            <div className="text-right font-mono text-sm">
              <p className="font-bold text-gray-900">${trader.totalNetWorth?.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Cash: ${trader.walletBalance?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}