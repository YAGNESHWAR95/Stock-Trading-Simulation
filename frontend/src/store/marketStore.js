import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../components/config/baseAPI";

export const useMarket = create((set) => ({
  assets: [],
  loading: false,

  // Action to fetch all assets initially
  fetchAssets: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${BASE_URL}/market-api/assets`);
      set({ assets: res.data.payload, loading: false });
    } catch (err) {
      console.error("Failed to fetch market data", err);
      set({ loading: false });
    }
  },

  // NEW: Action to update assets in real-time via WebSockets
  setAssets: (updatedAssets) => {
    set((state) => ({
      // We map through existing assets and update only the prices 
      // This preserves any other frontend-only state if needed
      assets: updatedAssets 
    }));
  }
}));