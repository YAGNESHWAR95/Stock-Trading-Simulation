import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [activeAssets, setActiveAssets] = useState([]); // Fetches assets natively
  const [form, setForm] = useState({ assetId: "", targetPrice: "", condition: "ABOVE" });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 1. Fetch active target stocks from backend market-api
  const fetchMarketAssets = async () => {
    try {
      const res = await axios.get("http://localhost:4000/market-api/assets");
      setActiveAssets(res.data.payload);
    } catch (err) {
      console.error("Failed to load live asset selectors", err);
    }
  };

  // 2. Fetch trader's active watch alert conditions
  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/trader-api/alerts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data.payload);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch active watch configurations", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketAssets();
    fetchAlerts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/trader-api/alerts", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ assetId: "", targetPrice: "", condition: "ABOVE" });
      fetchAlerts(); // Refresh rule feed view listing
    } catch (err) {
      alert("Failed to establish price condition boundary rule.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading Price Alert Panel...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Setup Price Change Alerts</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <select 
          className="w-full p-2 border rounded bg-white" 
          value={form.assetId} 
          onChange={e => setForm({...form, assetId: e.target.value})} 
          required
        >
          <option value="">Select Asset Target Index</option>
          {activeAssets?.map(asset => (
            <option key={asset._id} value={asset._id}>{asset.name} ({asset.symbol}) - ${asset.currentPrice}</option>
          ))}
        </select>
        
        <select 
          className="w-full p-2 border rounded bg-white" 
          value={form.condition} 
          onChange={e => setForm({...form, condition: e.target.value})}
        >
          <option value="ABOVE">Goes Above (≥)</option>
          <option value="BELOW">Drops Below (≤)</option>
        </select>

        <input 
          type="number" 
          step="0.01" 
          className="w-full p-2 border rounded" 
          placeholder="Target Evaluation Price ($)" 
          value={form.targetPrice} 
          onChange={e => setForm({...form, targetPrice: e.target.value})} 
          required 
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold transition">
          Establish Guard Watcher
        </button>
      </form>

      <div className="pt-4 border-t">
        <h3 className="font-semibold text-gray-700 mb-2">Active Watching Conditions</h3>
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No active price triggers set.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map(alert => (
              <li key={alert._id} className="text-sm border p-2 rounded flex justify-between bg-gray-50 items-center">
                <span className="font-bold text-blue-600">{alert.asset?.symbol}</span>
                <span className="text-gray-600">
                  Triggers when {alert.condition.toLowerCase()} <span className="font-semibold">${alert.targetPrice}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}