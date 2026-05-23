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
    
    // 1. Enforce Regulatory Guidelines Verification First
    if (!acceptedTerms) {
      toast.error("Please read and accept the SEBI guidelines to proceed.");
      return;
    }

    // 2. Client-Side Password Length Safeguard Interceptor
    if (formData.password.length < 8) {
      toast.error("Password is too short! It must be at least 8 characters long.");
      return; // Stops the submission pipeline instantly
    }

    try {
      // Execute registration query over our base instance layout configuration
      await baseAPI.post("/api/auth/register", formData);
      
      toast.success("Registration successful! Welcome to TradePro.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 border border-gray-100 rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Create Trader Account</h2>
        <p className="text-gray-500 text-sm">Fill in your details to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="text" placeholder="First Name" required 
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition" 
            value={formData.firstName} 
            onChange={e => setFormData({...formData, firstName: e.target.value})} 
          />
          <input 
            type="text" placeholder="Last Name" 
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition" 
            value={formData.lastName} 
            onChange={e => setFormData({...formData, lastName: e.target.value})} 
          />
        </div>
        
        <input 
          type="email" placeholder="Email Address" required 
          className="border p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
        />
        
        <input 
          type="password" placeholder="Password (Min. 8 chars)" required 
          className="border p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition" 
          value={formData.password} 
          onChange={e => setFormData({...formData, password: e.target.value})} 
        />

        {/* --- SEBI GUIDELINES FILE SECTION --- */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-6">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Regulatory Compliance
          </h3>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            To ensure investor protection, SEBI requires all market participants to review the standard operating procedures and risk disclosures.
          </p>
          
          <a 
            href="/sebi-guidelines.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition underline decoration-2 underline-offset-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Read Official SEBI Guidelines (PDF)
          </a>
        </div>

        {/* --- ACCEPT AND CONTINUE CHECKBOX --- */}
        <div className="flex items-start gap-3 py-2">
          <input 
            type="checkbox" 
            id="accept-terms" 
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label htmlFor="accept-terms" className="text-xs text-gray-600 leading-snug cursor-pointer select-none">
            I confirm that I have downloaded/read the SEBI guidelines and I **Accept and Continue** with this virtual trading simulation.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={!acceptedTerms}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md ${
            acceptedTerms 
            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95 cursor-pointer" 
            : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Create Account
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-500">
        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
      </div>
    </div>
  );
}