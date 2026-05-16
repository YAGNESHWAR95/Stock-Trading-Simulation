import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "./config/baseAPI";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";

export default function TraderDashboard() {
  const { currentUser, updateWalletBalance } = useAuth();
  const [portfolio, setPortfolio] = useState([]);

  const fetchPortfolio = () => {
    axios.get(`${BASE_URL}/trader-api/portfolio`, { withCredentials: true })
      .then(res => setPortfolio(res.data.payload))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // NEW: Handle Deposit Button Click
  const handleDeposit = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/trader-api/deposit`, {}, { withCredentials: true });
      updateWalletBalance(res.data.walletBalance);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to deposit funds");
    }
  };

  const totalPortfolioValue = portfolio.reduce((acc, item) => acc + (item.quantity * item.asset.currentPrice), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trader Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl">Available Cash</h2>
          <p className="text-4xl font-bold mt-2">${currentUser?.walletBalance?.toLocaleString()}</p>
          <div className="mt-4 flex gap-2">
            {/* UPDATED: Deposit button now works! */}
            <button 
              onClick={handleDeposit} 
              className="bg-white text-blue-600 px-4 py-2 rounded font-bold text-sm hover:bg-gray-100 transition"
            >
              Deposit $5,000
            </button>
            <button 
              onClick={() => toast("Withdrawals are disabled in demo mode!")}
              className="bg-blue-800 text-white px-4 py-2 rounded font-bold text-sm"
            >
              Withdraw
            </button>
          </div>
        </div>
        
        <div className="bg-green-600 text-white p-6 rounded-lg shadow">
          <h2 className="text-xl">Total Invested Value</h2>
          <p className="text-4xl font-bold mt-2">${totalPortfolioValue.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Holdings</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Asset</th>
              <th className="p-4 border-b">Quantity</th>
              <th className="p-4 border-b">Avg Buy Price</th>
              <th className="p-4 border-b">Current Price</th>
              <th className="p-4 border-b">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 border-b">
                <td className="p-4 font-bold">{item.asset.symbol}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">${item.averageBuyPrice.toLocaleString()}</td>
                <td className="p-4">${item.asset.currentPrice.toLocaleString()}</td>
                <td className="p-4 font-semibold text-green-600">${(item.quantity * item.asset.currentPrice).toLocaleString()}</td>
              </tr>
            ))}
            {portfolio.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No assets in portfolio yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}