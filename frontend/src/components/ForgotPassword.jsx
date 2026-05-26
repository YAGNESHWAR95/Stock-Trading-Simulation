import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      <p className="text-center text-sm text-gray-600 mb-6">
        Enter your email address and we will generate a password reset token for you.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full border p-2 rounded focus:outline-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-bold py-2 rounded mt-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Generating token..." : "Generate Reset Token"}
        </button>
      </form>
    </div>
  );
}
