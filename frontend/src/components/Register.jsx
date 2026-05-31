import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import baseAPI from "./config/baseAPI"; 
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast.error("Please read and accept the SEBI guidelines to proceed.");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      await baseAPI.post("/api/auth/register", formData);
      toast.success("Registration successful! Welcome to TradePro.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 relative">
      {/* Decorative backdrop aura */}
      <div className="absolute inset-0 -z-10 bg-emerald-500/10 rounded-3xl blur-2xl pointer-events-none" />

      <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-[var(--border-glass)] relative z-10 space-y-6 transition-colors duration-300">
        
        {/* Title Block */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-display font-black text-[hsl(var(--text-main))] tracking-wide">Create Account</h2>
          <p className="text-xs text-[hsl(var(--text-muted))]">Join TradePro virtual simulation platform</p>
        </div>
        
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* First & Last Name Sub-Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">First Name</label>
              <input 
                type="text" placeholder="Alex" required 
                className="premium-input w-full px-3 py-2.5 rounded-xl text-sm" 
                value={formData.firstName} 
                onChange={e => setFormData({...formData, firstName: e.target.value})} 
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Last Name</label>
              <input 
                type="text" placeholder="Mercer" 
                className="premium-input w-full px-3 py-2.5 rounded-xl text-sm" 
                value={formData.lastName} 
                onChange={e => setFormData({...formData, lastName: e.target.value})} 
              />
            </div>
          </div>
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Email Address</label>
            <input 
              type="email" placeholder="trader@example.com" required 
              className="premium-input w-full px-4 py-2.5 rounded-xl text-sm" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          
          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Password</label>
            <input 
              type="password" placeholder="Min. 8 characters" required 
              className="premium-input w-full px-4 py-2.5 rounded-xl text-sm" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          {/* Regulatory Compliance PDF Drawer */}
          <div className="bg-[hsl(var(--color-tertiary))]/60 p-4 rounded-xl border border-[var(--border-glass)] space-y-2 mt-4">
            <span className="text-[9px] font-bold text-[hsl(var(--text-muted))] uppercase tracking-widest block">Regulatory Compliance</span>
            <p className="text-[10px] text-[hsl(var(--text-muted))]/90 leading-relaxed">
              To ensure investor protection, SEBI requires all market participants to review the standard operating procedures and risk disclosures.
            </p>
            
            <a 
              href="/sebi-guidelines.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-400 transition hover:underline"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Official SEBI Guidelines (PDF)</span>
            </a>
          </div>

          {/* Regulatory Compliance Acknowledge Box */}
          <div className="flex items-start gap-3 py-2">
            <input 
              type="checkbox" 
              id="accept-terms" 
              className="mt-0.5 h-4 w-4 border-[var(--border-glass)] rounded bg-[hsl(var(--color-primary))] focus:ring-indigo-500 cursor-pointer"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="accept-terms" className="text-[11px] text-[hsl(var(--text-muted))] leading-snug cursor-pointer select-none">
              I confirm that I have reviewed the SEBI guidelines and I **Accept and Continue** with this virtual trading simulation.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={!acceptedTerms}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              acceptedTerms 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] active:scale-95 cursor-pointer" 
              : "bg-[hsl(var(--color-tertiary))] text-[hsl(var(--text-muted))]/40 border border-[var(--border-glass)] cursor-not-allowed"
            }`}
          >
            Create Account
          </button>
        </form>

        {/* Footer Account Prompt */}
        <div className="text-center text-xs text-[hsl(var(--text-muted))]">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-400 hover:underline">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}