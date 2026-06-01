import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import baseAPI from "./config/baseAPI";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await baseAPI.post("/api/auth/forgot-password", { email });
      toast.success("Reset instructions have been generated.");

      const token = res.data.payload?.token;
      if (token) {
        navigate(`/reset-password?token=${token}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to generate reset token.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 relative">
      {/* Decorative backdrop aura */}
      <div className="absolute inset-0 -z-10 bg-indigo-500/5 rounded-3xl blur-2xl pointer-events-none" />

      <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-[var(--border-glass)] relative z-10 space-y-6 transition-colors duration-300">
        
        {/* Title Block */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-display font-black text-[hsl(var(--text-main))] tracking-wide">Reset Password</h2>
          <p className="text-xs text-[hsl(var(--text-muted))]">Enter your email to retrieve your password token</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="trader@example.com"
              className="premium-input w-full px-4 py-3 rounded-xl text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl mt-4 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Generating Token..." : "Generate Reset Token"}
          </button>
        </form>

        {/* Return to login link */}
        <div className="text-center text-xs text-[hsl(var(--text-muted))]">
          Remembered your credentials?{" "}
          <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-400 hover:underline">
            Go to Log In
          </Link>
        </div>

      </div>
    </div>
  );
}

