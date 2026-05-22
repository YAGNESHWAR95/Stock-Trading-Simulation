import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TradingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/trader/history", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setHistory(res.data.payload);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading Historical Trade Audit Metrics...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow border">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Historical Trade Execution Analysis</h2>
      <div className="space-y-3">
        {history.map((order) => (
          <div key={order._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <span className={`px-2 py-1 text-xs font-bold rounded mr-2 ${order.orderType === "BUY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {order.orderType}
              </span>
              <span className="font-semibold text-gray-800">{order.asset?.name} ({order.asset?.symbol})</span>
              <p className="text-gray-400 text-xs mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${order.totalAmount}</p>
              <p className="text-gray-500 text-xs">{order.quantity} units @ ${order.priceAtExecution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}