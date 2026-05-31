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
    <div className="w-full overflow-hidden">
      <div className="flex gap-6 animate-marquee whitespace-nowrap py-2">
        {tickItems.map((it) => (
          <div key={it.id} className="inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium">
            <span className="font-semibold text-slate-800">{it.symbol}</span>
            <span className={`ml-1 ${it.isUp ? "text-emerald-600" : "text-rose-600"}`}>${it.price.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
        ))}
      </div>

      <style>{`\n        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }\n        .animate-marquee { animation: marquee 18s linear infinite; }\n      `}</style>
    </div>
  );
}
