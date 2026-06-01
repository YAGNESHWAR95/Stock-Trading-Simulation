import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 my-10 relative">
      <div className="absolute inset-0 -z-10 bg-rose-500/5 rounded-3xl blur-2xl pointer-events-none" />
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[var(--border-glass)] shadow-2xl relative z-10 space-y-6 text-center max-w-md w-full transition-colors duration-300">
        <span className="text-4xl block mb-2">🔐</span>
        <h2 className="text-2xl font-display font-black text-rose-500 tracking-wide">403 - Access Revoked</h2>
        <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">
          You do not have administrative clearance or matching trader credentials to access this secure terminal space.
        </p>
        <div className="pt-2">
          <Link 
            to="/" 
            className="w-full inline-flex justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer text-xs uppercase tracking-widest"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}