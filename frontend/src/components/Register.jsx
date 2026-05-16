import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "./config/baseAPI";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth-api/register`, formData);
      toast.success("Account created successfully! $10,000 demo cash added.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Create Trader Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input type="text" required className="w-full border p-2 rounded" 
            value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input type="text" className="w-full border p-2 rounded" 
            value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
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
        <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded mt-2 hover:bg-green-700 transition">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}