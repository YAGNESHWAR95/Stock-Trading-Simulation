import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import baseAPI from "./config/baseAPI"; 
import TradeForm from "./TradeForm";
import CandlestickChart from "./CandlestickChart"; 

export default function AssetByID() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // Target the singular endpoint matching marketRoute.get("/asset/:id")
    baseAPI.get(`/api/market/asset/${id}`)
      .then((res) => {
        const data = res.data?.payload || res.data;
        setAsset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching single asset details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading Asset Workspace...</div>;
  if (!asset) return <div className="text-center mt-10 text-red-500">Asset Data Unavailable.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Left Side: Chart & Performance Metrics */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{asset.name} ({asset.symbol})</h1>
            <p className="text-gray-500">Market Cap: ${(asset.marketCap || 0).toLocaleString()}</p>
          </div>
          <h2 className="text-4xl font-bold text-green-600">
            ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>
        
        {/* Interactive Candlestick Chart Feed */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <CandlestickChart assetName={asset.symbol} />
        </div>
      </div>

      {/* Right Side: Execution Order Entry Form */}
      <div>
        <TradeForm asset={asset} />
      </div>
    </div>
  );
}