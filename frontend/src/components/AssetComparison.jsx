import { useEffect, useMemo, useState } from "react";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

export default function AssetComparison() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        const res = await baseAPI.get("/api/market/assets");
        setAssets(res.data?.payload || res.data || []);
      } catch (err) {
        console.error("Asset comparison load failed", err);
        toast.error("Unable to load market assets.");
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  const toggleSelection = (assetId) => {
    setSelected((current) => {
      if (current.includes(assetId)) return current.filter((id) => id !== assetId);
      if (current.length >= 3) return current;
      return [...current, assetId];
    });
  };

  const selectedAssets = useMemo(
    () => assets.filter((asset) => selected.includes(asset._id)),
    [assets, selected]
  );

  if (loading) return <div className="text-center py-10">Preparing compare mode...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Comparison Mode</p>
            <h1 className="text-2xl font-semibold text-slate-900">Compare up to 3 assets side-by-side</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {selected.length} / 3 selected
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Market Asset Selection</h2>
          <div className="mt-5 grid gap-3 max-h-[420px] overflow-y-auto pr-2">
            {assets.slice(0, 20).map((asset) => (
              <button
                key={asset._id}
                type="button"
                onClick={() => toggleSelection(asset._id)}
                className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                  selected.includes(asset._id)
                    ? "border-teal-500 bg-teal-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">{asset.symbol}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900">{asset.name}</h3>
                  </div>
                  <span className="text-sm font-bold text-slate-700">${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Comparison Table</h2>
          {selectedAssets.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              Select assets from the left panel to compare live metrics.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left text-slate-500">
                    <th className="border-b border-slate-200 px-4 py-3">Asset</th>
                    <th className="border-b border-slate-200 px-4 py-3">Price</th>
                    <th className="border-b border-slate-200 px-4 py-3">Market Cap</th>
                    <th className="border-b border-slate-200 px-4 py-3">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAssets.map((asset) => (
                    <tr key={asset._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-900">{asset.symbol} — {asset.name}</td>
                      <td className="px-4 py-4 text-slate-700">${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-4 text-slate-700">${(asset.marketCap || 0).toLocaleString()}</td>
                      <td className="px-4 py-4 text-slate-700">{asset.isActive ? "Active" : "Halted"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
