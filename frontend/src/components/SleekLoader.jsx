import React from "react";

export default function SleekLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(var(--color-primary))]/80 backdrop-blur-md transition-colors duration-300">
      
      {/* Background ambient orbs specifically for the loader to look premium */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[var(--bg-orb-1)] blur-[80px] pointer-events-none animate-pulse duration-4000" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[var(--bg-orb-2)] blur-[80px] pointer-events-none animate-pulse duration-3000" />

      {/* Main glass panel loader */}
      <div className="glass-panel relative flex flex-col items-center justify-center p-8 rounded-2xl max-w-sm w-full mx-4 shadow-2xl border border-white/10 text-center animate-fade-in">
        
        {/* Animated logo/ring */}
        <div className="relative w-16 h-16 mb-6">
          {/* Inner glowing core */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 opacity-20 blur-md animate-ping" />
          
          {/* Outer glowing spinner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 border-r-indigo-500 animate-spin" />
          
          {/* Inner ring spinning backwards */}
          <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-pink-500 border-l-cyan-500 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
          
          {/* Center tiny dot */}
          <div className="absolute inset-[24px] rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
        </div>

        {/* Loading text with Outfit font */}
        <h3 className="font-display text-lg font-semibold tracking-wide text-[hsl(var(--text-main))] mb-2">
          Syncing Market Data
        </h3>
        
        {/* Subtext description */}
        <p className="text-xs text-[hsl(var(--text-muted))] max-w-[200px] leading-relaxed">
          Securing connection to real-time asset feeds...
        </p>

        {/* Dynamic progress simulator bar */}
        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mt-5">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-pink-500 rounded-full animate-loader-bar" />
        </div>
      </div>

      {/* Tailwind & CSS dynamic animations injector */}
      <style>{`
        @keyframes loader-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loader-bar {
          animation: loader-bar 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
