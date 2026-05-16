import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMarket } from "../store/marketStore";

export default function Market() {
  const { assets, fetchAssets, loading } = useMarket();

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  if (loading) return <div>Loading Market Data...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Market</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div key={asset._id} className="bg-white p-5 rounded-lg shadow border hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{asset.symbol}</h2>
            <p className="text-sm text-gray-500 mb-4">{asset.name}</p>
            <p className="text-2xl font-semibold text-green-600">${asset.currentPrice.toLocaleString()}</p>
            
            <Link to={`/asset/${asset._id}`}>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Explore & Trade
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}