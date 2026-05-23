import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../store/marketStore";
import { socket } from "./config/socket";

export default function Market() {
  const { assets, fetchAssets, loading, setAssets } = useMarket();
  const [prevPrices, setPrevPrices] = useState({});

  useEffect(() => {
    // 1. Fetch initial data once
    fetchAssets();

    // 2. Connect socket only once
    if (!socket.connected) {
      socket.connect();
    }

    // 3. Listen for live updates
    socket.on("market-data-update", (updatedAssets) => {
      // store previous prices before updating UI
      setPrevPrices((prev) => {
        const newPrev = { ...prev };

        updatedAssets.forEach((asset) => {
          newPrev[asset._id] = asset.currentPrice;
        });

        return newPrev;
      });

      // update store
      setAssets(updatedAssets);
    });

    // cleanup
    return () => {
      socket.off("market-data-update");
    };
  }, []);

  // safer loading check
  if (loading && assets.length === 0) {
    return (
      <div className="text-center py-10">
        Loading Market Data...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Live Market</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(assets || []).map((asset) => {
          const prevPrice = prevPrices[asset._id];

          const isUp =
            prevPrice !== undefined && asset.currentPrice > prevPrice;
          const isDown =
            prevPrice !== undefined && asset.currentPrice < prevPrice;

          return (
            <div
              key={asset._id}
              className="bg-white p-5 rounded-xl shadow border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{asset.symbol}</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    {asset.name}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    isUp
                      ? "bg-green-100 text-green-700"
                      : isDown
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isUp ? "▲" : isDown ? "▼" : "●"} LIVE
                </span>
              </div>

              <div className="mt-4">
                <p
                  className={`text-2xl font-mono font-bold ${
                    isUp
                      ? "text-green-500"
                      : isDown
                      ? "text-red-500"
                      : "text-gray-800"
                  }`}
                >
                  $
                  {asset.currentPrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <Link to={`/asset/${asset._id}`}>
                <button className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-transform">
                  Explore & Trade
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}