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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[hsl(var(--text-muted))] font-semibold text-sm">Initializing asset telemetry and feeds...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center border-rose-500/20 text-rose-500 py-12">
        <svg className="w-12 h-12 mx-auto text-rose-500/80 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-bold text-lg">Asset Data Unavailable.</p>
        <p className="text-sm text-[hsl(var(--text-muted))] mt-1">Verify that this asset symbol is currently listed on the exchange.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-1 sm:p-4">
      {/* Left Side: Chart & Performance Metrics */}
      <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-xl relative overflow-hidden transition-colors duration-300">
        
        {/* Dynamic header stats panel */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Equity Asset</span>
            <h1 className="text-3xl font-display font-black text-[hsl(var(--text-main))] leading-tight tracking-tight">
              {asset.name}{" "}
              <span className="text-indigo-400 font-extrabold">({asset.symbol})</span>
            </h1>
            <p className="text-xs text-[hsl(var(--text-muted))] font-medium">
              Market Capitalization: <span className="font-bold font-mono text-[hsl(var(--text-main))]">${(asset.marketCap || 0).toLocaleString()}</span>
            </p>
          </div>
          
          <div className="space-y-1 text-left sm:text-right">
            <span className="text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Live Spot price</span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-emerald-500 neon-text-green font-mono">
              ${asset.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
        
        {/* Interactive Candlestick Chart Feed */}
        <div className="border border-[var(--border-glass)] rounded-2xl overflow-hidden shadow-inner bg-slate-950/20">
          <CandlestickChart assetName={asset.symbol} />
        </div>
      </div>

      {/* Right Side: Execution Order Entry Form */}
      <div className="space-y-6">
        <TradeForm asset={asset} />
      </div>
    </div>
  );
}