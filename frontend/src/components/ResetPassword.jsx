import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import baseAPI from "./config/baseAPI";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("No reset token found. Start with forgot password.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await baseAPI.post("/api/auth/reset-password", { token, password });
      toast.success("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-16 relative">
        <div className="absolute inset-0 -z-10 bg-rose-500/5 rounded-3xl blur-2xl pointer-events-none" />
        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-[var(--border-glass)] relative z-10 space-y-6 text-center transition-colors duration-300">
          <h2 className="text-2xl font-display font-black text-rose-500 tracking-wide">Access Revoked</h2>
          <p className="text-sm text-[hsl(var(--text-muted))]">
            No secure password reset token was provided in the request query parameters.
          </p>
          <div className="text-center pt-2">
            <Link to="/forgot-password" className="text-indigo-500 font-bold hover:text-indigo-400 hover:underline text-sm">
              Request Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 relative">
      {/* Decorative backdrop aura */}
      <div className="absolute inset-0 -z-10 bg-indigo-500/5 rounded-3xl blur-2xl pointer-events-none" />

      <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-[var(--border-glass)] relative z-10 space-y-6 transition-colors duration-300">
        
        {/* Title Block */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-display font-black text-[hsl(var(--text-main))] tracking-wide">New Credentials</h2>
          <p className="text-xs text-[hsl(var(--text-muted))]">Establish your new platform password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="premium-input w-full px-4 py-3 rounded-xl text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[hsl(var(--text-muted))] uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Repeat password"
              className="premium-input w-full px-4 py-3 rounded-xl text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl mt-4 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:scale-[1.01] transition-all duration-200 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

