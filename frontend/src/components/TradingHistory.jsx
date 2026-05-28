import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";

export default function TradingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baseAPI.get("/api/trader/history")
      .then((res) => {
        setHistory(res.data?.payload || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("History logging extraction failure:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Extracting Historical Audit Records...</div>;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-700">Chronological Clearing logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
        <thead>
          <tr className="bg-gray-100/70 text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
            <th className="p-4">Execution Time</th>
            <th className="p-4">Asset</th>
            <th className="p-4">Side</th>
            <th className="p-4">Size</th>
            <th className="p-4">Execution Price</th>
            <th className="p-4">Total Realized Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y font-mono text-sm text-gray-700">
          {history.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50/80">
              <td className="p-4 font-sans text-gray-400 text-xs">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="p-4 font-sans font-bold text-gray-800">
                {order.asset?.symbol || "TOKEN"}
              </td>
              <td className="p-4">
                <span className={
                  "px-2 py-0.5 rounded text-xs font-bold " +
                  (order.orderType === "BUY"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700")
                }>
                  {order.orderType}
                </span>
              </td>
              <td className="p-4">{order.quantity}</td>
              <td className="p-4">${order.priceAtExecution?.toLocaleString()}</td>
              <td className="p-4 font-bold">${order.totalAmount?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}