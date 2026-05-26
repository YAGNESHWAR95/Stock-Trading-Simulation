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
      <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          No reset token was provided. Please start with the forgot password page.
        </p>
        <div className="text-center">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={8}
            className="w-full border p-2 rounded focus:outline-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            required
            minLength={8}
            className="w-full border p-2 rounded focus:outline-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-bold py-2 rounded mt-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Resetting password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
