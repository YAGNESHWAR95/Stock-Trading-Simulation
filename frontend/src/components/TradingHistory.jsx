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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Loading cleared transaction ledger...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
      <div className="px-6 py-5 border-b border-[var(--border-glass)] bg-[hsl(var(--color-tertiary))]/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-base">Chronological Clearing Logs</h3>
        </div>
        <span className="bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-[10px] text-indigo-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {history.length} Transactions
        </span>
      </div>

      <div className="overflow-x-auto">
        {history.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <svg className="w-12 h-12 text-[hsl(var(--text-muted))]/60 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[hsl(var(--text-muted))] font-semibold">No transactions cleared yet.</p>
            <p className="text-xs text-[hsl(var(--text-muted))]/80">Visit the live market board to execute your first simulated trade order.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-[hsl(var(--color-tertiary))]/15 text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest border-b border-[var(--border-glass)]">
                <th className="px-6 py-4">Execution Time</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Side</th>
                <th className="px-6 py-4 text-right">Size</th>
                <th className="px-6 py-4 text-right">Execution Price</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-glass)] text-sm font-medium text-[hsl(var(--text-main))]">
              {history.map((order) => {
                const isBuy = order.orderType === "BUY";
                return (
                  <tr key={order._id} className="hover:bg-white/[0.01] transition duration-150">
                    <td className="px-6 py-4 font-mono text-xs text-[hsl(var(--text-muted))]">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-display font-bold text-[hsl(var(--text-main))] text-sm">
                        {order.asset?.symbol || "TOKEN"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                        isBuy 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15" 
                          : "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                      }`}>
                        {order.orderType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[hsl(var(--text-muted))]">
                      {order.quantity?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[hsl(var(--text-muted))]">
                      ${order.priceAtExecution?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[hsl(var(--text-main))]">
                      ${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}