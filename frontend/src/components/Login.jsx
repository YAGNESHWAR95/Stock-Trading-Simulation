import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Access state data passed down from your ProtectedRoute router guard
  const { login, isAuthenticated, error, currentUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back!");
      
      if (currentUser?.role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        // 1. Check if a dynamic history redirect state was captured by the router guard
        const dynamicReturnPath = location.state?.from?.pathname;
        
        // 2. If it exists, send them back to their current refresh tab; otherwise fallback to "/market"
        const targetPath = dynamicReturnPath || "/market";
        
        navigate(targetPath, { replace: true });
      }
    } else if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error, navigate, currentUser, location]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Trader Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input 
            type="email" 
            required 
            className="w-full border p-2 rounded focus:outline-blue-500" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            required 
            className="w-full border p-2 rounded focus:outline-blue-500" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded mt-2 hover:bg-blue-700 transition">
          Log In
        </button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/auth/google`}
          className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>
      </div>

      <p className="text-center mt-4 text-sm">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot your password?</Link>
      </p>
      <p className="text-center mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}