import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:4000/trader-api/leaderboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setLeaders(res.data.payload);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to compile leaderboard statistics.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-center text-xl">Compiling Leaderboard Positions...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 Trading Net Worth Leaderboard</h2>
      <div className="divide-y">
        {leaders.map((trader, index) => (
          <div key={index} className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 transition rounded-lg">
            <div className="flex items-center space-x-3">
              <span className={`font-bold text-lg w-6 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-gray-300"}`}>
                #{index + 1}
              </span>
              <span className="font-semibold text-gray-800">{trader.username}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">${trader.totalNetWorth}</p>
              <p className="text-xs text-gray-400">Cash: ${trader.walletBalance} | Portfolio: ${trader.portfolioValue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}