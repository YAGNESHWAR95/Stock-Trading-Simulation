import { useState } from "react";
import axios from "axios";
import BASE_URL from "./config/baseAPI";

export default function AdminDashboard() {
  const [assetForm, setAssetForm] = useState({ symbol: "", name: "", currentPrice: 0, marketCap: 0 });

  const handleListAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/admin-api/asset`, assetForm, { withCredentials: true });
      alert("New asset listed successfully!");
      setAssetForm({ symbol: "", name: "", currentPrice: 0, marketCap: 0 });
    } catch (err) {
      alert("Failed to list asset: " + err.response?.data?.message);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-4">List New Asset</h2>
          <form onSubmit={handleListAsset}>
            <div className="mb-4">
              <label className="block text-sm">Symbol (e.g., AAPL)</label>
              <input type="text" className="w-full border p-2 rounded mt-1" required
                value={assetForm.symbol} onChange={(e) => setAssetForm({...assetForm, symbol: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Asset Name</label>
              <input type="text" className="w-full border p-2 rounded mt-1" required
                value={assetForm.name} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm">Initial Price ($)</label>
                <input type="number" className="w-full border p-2 rounded mt-1" required
                  value={assetForm.currentPrice} onChange={(e) => setAssetForm({...assetForm, currentPrice: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm">Market Cap ($)</label>
                <input type="number" className="w-full border p-2 rounded mt-1" 
                  value={assetForm.marketCap} onChange={(e) => setAssetForm({...assetForm, marketCap: Number(e.target.value)})} />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Add to Exchange</button>
          </form>
        </div>
      </div>

      <div>
         <h2 className="text-2xl font-bold mb-4 mt-10 lg:mt-0">Platform Statistics</h2>
         <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
            <p className="text-gray-400">Total 24h Trading Volume</p>
            <h3 className="text-4xl font-bold mt-2 text-green-400">$1,245,000.00</h3>
            {/* Additional Admin metrics can be rendered here */}
         </div>
      </div>
    </div>
  );
}