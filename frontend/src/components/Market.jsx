import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../store/marketStore";
import { io } from "socket.io-client";
import BASE_URL from "../components/config/baseAPI";

// Initialize socket connection
const socket = io(BASE_URL, { withCredentials: true });

export default function Market() {
  const { assets, fetchAssets, loading, setAssets } = useMarket();
  const [prevPrices, setPrevPrices] = useState({});

  useEffect(() => {
    // Initial fetch
    fetchAssets();

    // Listen for real-time updates from backend
    socket.on("market-data-update", (updatedAssets) => {
      // Store current prices to compare for the "flash" effect
      setPrevPrices((prev) => {
        const newPrev = { ...prev };
        updatedAssets.forEach((a) => {
          newPrev[a._id] = a.currentPrice;
        });
        return newPrev;
      });

      // Update the global market store
      // Note: Ensure your marketStore has a 'setAssets' action
      if (setAssets) {
        setAssets(updatedAssets);
      }
    });

    // Cleanup on unmount
    return () => socket.off("market-data-update");
  }, [fetchAssets, setAssets]);

  if (loading) return <div className="text-center py-10">Loading Market Data...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Live Market</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset) => {
          const prevPrice = prevPrices[asset._id];
          const isUp = asset.currentPrice > prevPrice;
          const isDown = asset.currentPrice < prevPrice;

          return (
            <div key={asset._id} className="bg-white p-5 rounded-xl shadow border hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{asset.symbol}</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{asset.name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${isUp ? 'bg-green-100 text-green-700' : isDown ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                   {isUp ? '▲' : isDown ? '▼' : '●'} LIVE
                </span>
              </div>

              <div className="mt-4">
                {/* Price with conditional coloring and smooth transition */}
                <p className={`text-2xl font-mono font-bold transition-colors duration-500 ${
                  isUp ? "text-green-500" : isDown ? "text-red-500" : "text-gray-800"
                }`}>
                  ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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