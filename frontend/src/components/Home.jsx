import { Link } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-12">
      
      {/* Visual Accent Glow Backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[70%] h-[70%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container Workspace */}
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Main Hero Header Title */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-[hsl(var(--color-accent-indigo))] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
            Simulated Paper Exchange
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-[hsl(var(--text-main))] leading-tight tracking-tight">
            Master the Markets with{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm font-black">
              TradePro
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[hsl(var(--text-muted))] max-w-2xl mx-auto font-medium leading-relaxed">
            Experience real-time virtual trading. Get $100,000 in demo cash when you sign up and test your financial strategies risk-free on real live fluctuations.
          </p>
        </div>

        {/* Dynamic Navigation Action Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto pt-4">
          {isAuthenticated ? (
            <Link 
              to="/market" 
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition duration-200 text-center cursor-pointer"
            >
              Enter Market Board
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-[1.02] transition duration-200 text-center cursor-pointer"
              >
                Start Trading Now
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-[hsl(var(--color-tertiary))]/50 hover:bg-[hsl(var(--color-tertiary))] border border-[var(--border-glass)] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] px-8 py-3.5 rounded-xl font-bold text-base transition duration-200 text-center cursor-pointer"
              >
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards Grid (Neat and Clean) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 max-w-3xl mx-auto">
          
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] text-center space-y-2">
            <div className="w-10 h-10 bg-[hsl(var(--color-accent-indigo))]/10 border border-[hsl(var(--color-accent-indigo))]/15 rounded-xl flex items-center justify-center text-[hsl(var(--color-accent-indigo))] mx-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-sm">Demo Wallet</h3>
            <p className="text-xs text-[hsl(var(--text-muted))] leading-normal">Practice paper trading with a default $100,000 risk-free account balance.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] text-center space-y-2">
            <div className="w-10 h-10 bg-[hsl(var(--color-accent-teal))]/10 border border-[hsl(var(--color-accent-teal))]/15 rounded-xl flex items-center justify-center text-[hsl(var(--color-accent-teal))] mx-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-sm">Real-Time Feeds</h3>
            <p className="text-xs text-[hsl(var(--text-muted))] leading-normal">Track price updates streaming continuously via persistent WebSockets.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] text-center space-y-2">
            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/15 rounded-xl flex items-center justify-center text-purple-400 mx-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-display font-extrabold text-[hsl(var(--text-main))] text-sm">Groq AI Doubt Clearer</h3>
            <p className="text-xs text-[hsl(var(--text-muted))] leading-normal">Consult a virtual assistant using Llama-3.3 on demand for strategy queries.</p>
          </div>

        </div>

      </div>
    </div>
  );
}