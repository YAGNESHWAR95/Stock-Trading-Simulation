import { useRouteError, Link } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error("Caught by ErrorBoundary:", error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--color-primary))] px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative backdrop aura */}
      <div className="absolute inset-0 -z-10 bg-rose-500/5 rounded-3xl blur-2xl pointer-events-none" />

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[var(--border-glass)] shadow-2xl relative z-10 space-y-6 text-center max-w-md w-full transition-colors duration-300">
        <span className="text-4xl block mb-2">⚠️</span>
        <h1 className="text-3xl font-display font-black text-rose-500 tracking-wide">Interface Error</h1>
        <p className="text-sm text-[hsl(var(--text-main))] font-bold">Sorry, an unexpected routing anomaly has occurred.</p>
        
        {/* Display the actual error message */}
        <p className="text-[10px] text-rose-400 font-mono bg-rose-950/20 border border-rose-500/10 p-3 rounded-xl break-words leading-relaxed">
          {error?.statusText || error?.message || "Internal routing context or network pipeline error."}
        </p>
        
        <div className="pt-2">
          <Link 
            to="/" 
            className="w-full inline-flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer text-xs uppercase tracking-widest"
          >
            Return to Exchange
          </Link>
        </div>
      </div>
    </div>
  );
}