import { useEffect, useState } from "react";
import { socket } from "./config/socket";

export default function LiveTicker({ maxItems = 10 }) {
  const [tickItems, setTickItems] = useState([]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleMarket = (updates) => {
      // keep latest price per symbol
      const latest = updates.slice(0, maxItems).map((a) => ({
        id: a._id,
        symbol: a.symbol,
        price: a.currentPrice,
        isUp: a.isUp,
      }));
      setTickItems(latest);
    };

    socket.on("market-data-update", handleMarket);

    return () => {
      socket.off("market-data-update", handleMarket);
    };
  }, [maxItems]);

  if (!tickItems.length) return null;

  return (
    <div className="w-full overflow-hidden glass-panel py-2.5 rounded-2xl border border-[var(--border-glass)] shadow-md mb-2">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {tickItems.map((it) => (
          <div key={it.id} className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold font-mono">
            <span className="text-[hsl(var(--text-main))] font-display font-black tracking-wider">{it.symbol}</span>
            <span className={`inline-flex items-center gap-1 font-bold ${it.isUp ? "text-emerald-500" : "text-rose-500"}`}>
              {it.isUp ? "▲" : "▼"} ${it.price.toLocaleString(undefined, {minimumFractionDigits:2})}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-33%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
}

