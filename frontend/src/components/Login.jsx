import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
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
        navigate("/admin-dashboard");
      } else {
        navigate("/market");
      }
    } else if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error, navigate, currentUser]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Trader Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input type="email" required className="w-full border p-2 rounded" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required className="w-full border p-2 rounded" 
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded mt-2 hover:bg-blue-700 transition">
          Log In
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}