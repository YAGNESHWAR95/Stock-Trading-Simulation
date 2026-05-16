import { useState } from "react";
import axios from "axios";
import BASE_URL from "./config/baseAPI";
import { useAuth } from "../store/authStore";

export default function TradeForm({ asset }) {
  const [orderType, setOrderType] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const { currentUser, updateWalletBalance } = useAuth();
  
  const totalCost = quantity * asset.currentPrice;

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      // Assuming you built the BUY endpoint in TraderAPI.js
      const endpoint = orderType === "BUY" ? "/trader-api/buy" : "/trader-api/sell";
      
      const res = await axios.post(
        `${BASE_URL}${endpoint}`,
        { assetId: asset._id, quantity },
        { withCredentials: true }
      );
      
      alert(`Trade Successful! Order executed at $${asset.currentPrice}`);
      if (res.data.walletBalance) {
        updateWalletBalance(res.data.walletBalance);
      }
    } catch (err) {
      alert("Trade Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Trade {asset.symbol}</h3>
      <p className="mb-4 text-sm text-gray-600">Wallet Balance: <span className="font-bold">${currentUser?.walletBalance?.toLocaleString()}</span></p>
      
      <form onSubmit={handleTrade}>
        <div className="flex mb-4">
          <button type="button" onClick={() => setOrderType("BUY")} className={`flex-1 py-2 font-bold ${orderType === "BUY" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}>BUY</button>
          <button type="button" onClick={() => setOrderType("SELL")} className={`flex-1 py-2 font-bold ${orderType === "SELL" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}>SELL</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input 
            type="number" 
            step="0.01"
            min="0.01"
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div className="mb-6 bg-gray-50 p-3 rounded border text-center">
          <p className="text-sm text-gray-500">Estimated Total</p>
          <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
        </div>

        <button type="submit" className={`w-full py-3 text-white font-bold rounded ${orderType === "BUY" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
          Execute {orderType} Order
        </button>
      </form>
    </div>
  );
}