import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "./config/baseAPI";
import TradeForm from "./TradeForm";
import CandlestickChart from "./CandlestickChart"; // <-- Import the chart

export default function AssetByID() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/market-api/asset/${id}`)
      .then((res) => setAsset(res.data.payload))
      .catch((err) => console.error(err));
  }, [id]);

  if (!asset) return <div className="text-center mt-10">Loading Asset...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side: Chart & Info */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{asset.name} ({asset.symbol})</h1>
            <p className="text-gray-500">Market Cap: ${(asset.marketCap || 0).toLocaleString()}</p>
          </div>
          <h2 className="text-4xl text-green-600">${asset.currentPrice.toLocaleString()}</h2>
        </div>
        
        {/* Render the Candlestick Chart Here */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <CandlestickChart assetName={asset.symbol} />
        </div>
      </div>

      {/* Right Side: Order Entry Form */}
      <div>
        <TradeForm asset={asset} />
      </div>
    </div>
  );
}