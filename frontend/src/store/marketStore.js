import { create } from "zustand";
import baseAPI from "../components/config/baseAPI";

export const useMarket = create((set) => ({
  assets: [], 
  loading: false,
  error: null,

  // Action to fetch all assets initially via REST
  fetchAssets: async () => {
    try {
      set({ loading: true, error: null });
      
      // Target the new plural endpoint matching app.use("/api/market", marketRoute)
      const res = await baseAPI.get("/api/market/assets");
      
      const incomingData = res.data?.payload || res.data;
      
      set({ 
        assets: Array.isArray(incomingData) ? incomingData : [], 
        loading: false 
      });
    } catch (err) {
      console.error("Error fetching market options:", err);
      set({ 
        assets: [], 
        loading: false, 
        error: err.response?.data?.message || "Failed to fetch assets" 
      });
    }
  },

  // Action to cleanly sync updated assets downstream from WebSockets
  setAssets: (updatedAssets) => set({ 
    assets: Array.isArray(updatedAssets) ? updatedAssets : [],
    loading: false 
  })
}));