import { useEffect, useState } from "react";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [marketAssets, setMarketAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states for creating a new alert condition rule
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState("ABOVE");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch active alerts and market choices simultaneously on layout mount
  const loadAlertsWorkspace = async () => {
    await Promise.resolve();
    try {
      setLoading(true);
      const [alertsRes, marketRes] = await Promise.all([
        baseAPI.get("/api/trader/alerts"),
        baseAPI.get("/api/market/assets") // Pulls tickers so you can pick from a dropdown list
      ]);

      setAlerts(alertsRes.data?.payload || []);
      
      const tokens = marketRes.data?.payload || marketRes.data || [];
      setMarketAssets(tokens);
      
      if (tokens.length > 0) {
        setSelectedAssetId(tokens[0]._id);
      }
    } catch (err) {
      console.error("Failed to load alerts telemetry context:", err);
      toast.error("Error connecting to monitoring feed rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsWorkspace();
  }, []);

  // 2. Handle creating a new watch rule condition
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !targetPrice) {
      toast.error("Please fill in all trigger parameters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await baseAPI.post("/api/trader/alerts", {
        assetId: selectedAssetId,
        targetPrice: Number(targetPrice),
        condition: condition
      });

      toast.success(res.data?.message || "Price monitoring rule locked in!");
      setTargetPrice("");
      
      // Reload list instantly to reveal the new data row entry
      await loadAlertsWorkspace();
    } catch (err) {
      console.error("Alert Creation Error:", err);
      toast.error(err.response?.data?.message || "Failed to compile monitoring trigger.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Syncing Trigger Monitor Channels...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Interactive Form Panel to Create Rules */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔔 Configure New Price Guard Rule
        </h3>
        
        <form onSubmit={handleCreateAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Asset</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-blue-500 font-medium"
            >
              {marketAssets.map(asset => (
                <option key={asset._id} value={asset._id}>
                  {asset.symbol} — ({asset.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Condition Trigger</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-blue-500 font-bold"
            >
              <option value="ABOVE" className="text-green-600">Goes ABOVE (▲)</option>
              <option value="BELOW" className="text-red-600">Drops BELOW (▼)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Boundary Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 65000.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-blue-500 font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-all shadow-sm active:scale-98 disabled:bg-gray-400"
          >
            {submitting ? "Saving Rule..." : "Arm Watch Trigger"}
          </button>
        </form>
      </div>

      {/* Active Watch Rules Table Display */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Active Price Watch Rules Ledger</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {alerts.length} Rules Armed
          </span>
        </div>
        
        <div className="divide-y">
          {alerts.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-400">
              No active custom watch rules currently registered. Use the configuration panel above to arm a condition.
            </p>
          ) : (
            alerts.map((alert) => (
              <div key={alert._id} className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                <div>
                  <span className="font-bold text-gray-800 text-base">
                    {alert.asset?.name || "Asset"} ({alert.asset?.symbol || "Unknown"})
                  </span>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Live Database Ticker Price: ${alert.asset?.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </div>
                </div>
                
                <div className="text-right font-mono text-sm flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-black tracking-wide ${
                    alert.condition === "ABOVE" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    IF VALUE {alert.condition}
                  </span>
                  <span className="font-extrabold text-gray-900 text-base">
                    ${alert.targetPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}