import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error, currentUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back!");
      
      if (currentUser?.role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        const dynamicReturnPath = location.state?.from?.pathname;
        const targetPath = dynamicReturnPath || "/market";
        navigate(targetPath, { replace: true });
      }
    } else if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error, navigate, currentUser, location]);

  return (
    <div className="max-w-md mx-auto my-12 relative">
      {/* Decorative backdrop aura */}
      <div className="absolute inset-0 -z-10 bg-indigo-500/10 rounded-3xl blur-2xl pointer-events-none" />

      <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-white/5 relative z-10 space-y-6">
        
        {/* Title Block */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-display font-black text-white tracking-wide">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to manage your paper portfolio</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="trader@example.com"
              className="premium-input w-full px-4 py-3 rounded-xl text-sm" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              required 
              placeholder="Enter password"
              className="premium-input w-full px-4 py-3 rounded-xl text-sm" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl mt-4 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer text-sm"
          >
            Log In
          </button>
          
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google OAuth Button */}
        <div>
          <button
            type="button"
            onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-900 border border-white/10 rounded-xl py-3 text-slate-200 hover:text-white transition duration-200 cursor-pointer text-sm font-semibold"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Account Prompt */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}