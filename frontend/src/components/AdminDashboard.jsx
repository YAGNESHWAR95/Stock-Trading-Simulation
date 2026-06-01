import { useState } from "react";
import baseAPI from "./config/baseAPI";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [assetForm, setAssetForm] = useState({ symbol: "", name: "", currentPrice: 0, marketCap: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleListAsset = async (e) => {
    e.preventDefault();
    if (!assetForm.symbol || !assetForm.name || assetForm.currentPrice <= 0) {
      toast.error("Please fill in all listing parameters.");
      return;
    }

    try {
      setSubmitting(true);
      await baseAPI.post("/api/admin/asset", assetForm);
      toast.success("New asset listed on exchange successfully!");
      setAssetForm({ symbol: "", name: "", currentPrice: 0, marketCap: 0 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list new asset.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-1 sm:p-4 transition-colors duration-300">
      
      {/* List New Asset Panel */}
      <div className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden">
          
          <div className="mb-6 border-b border-[var(--border-glass)] pb-4">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Control Terminal</span>
            <h2 className="text-xl font-display font-black text-[hsl(var(--text-main))]">List New Asset</h2>
          </div>

          <form onSubmit={handleListAsset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Symbol (e.g. AAPL)</label>
              <input 
                type="text" 
                placeholder="AAPL"
                className="premium-input w-full px-4 py-3 rounded-xl text-xs uppercase font-mono font-bold" 
                required
                value={assetForm.symbol} 
                onChange={(e) => setAssetForm({...assetForm, symbol: e.target.value})} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Asset Name</label>
              <input 
                type="text" 
                placeholder="Apple Inc."
                className="premium-input w-full px-4 py-3 rounded-xl text-xs font-semibold" 
                required
                value={assetForm.name} 
                onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Initial Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="150.00"
                  className="premium-input w-full px-4 py-3 rounded-xl text-xs font-mono font-bold" 
                  required
                  value={assetForm.currentPrice || ""} 
                  onChange={(e) => setAssetForm({...assetForm, currentPrice: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Market Cap ($)</label>
                <input 
                  type="number" 
                  placeholder="2000000000"
                  className="premium-input w-full px-4 py-3 rounded-xl text-xs font-mono font-bold" 
                  value={assetForm.marketCap || ""} 
                  onChange={(e) => setAssetForm({...assetForm, marketCap: Number(e.target.value)})} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl mt-4 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Listing Asset..." : "Add to Exchange"}
            </button>
          </form>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          
          <div className="mb-4">
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Exchange Metrics</span>
            <h2 className="text-xl font-display font-black text-[hsl(var(--text-main))]">Platform Statistics</h2>
          </div>

          <div className="bg-[hsl(var(--color-tertiary))]/50 border border-[var(--border-glass)] p-6 rounded-2xl space-y-2 mt-4 grow flex flex-col justify-center">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Total 24h Trading Volume</span>
            <h3 className="text-4xl font-display font-black text-emerald-400 neon-text-green font-mono">
              $1,245,000.00
            </h3>
            <p className="text-[10px] text-[hsl(var(--text-muted))] font-medium leading-relaxed pt-2">
              Aggregated clearing volume streams representing live simulated liquidity thresholds on the simulated exchange database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}