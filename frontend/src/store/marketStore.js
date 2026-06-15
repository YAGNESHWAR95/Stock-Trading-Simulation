import { create } from "zustand";
import baseAPI from "../components/config/baseAPI";
import { toast } from "react-hot-toast";

export const useMarket = create((set) => ({
  assets: [], 
  loading: false,
  error: null,
  selectedCompare: [],

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
  }),

  // Set selected compare list directly
  setSelectedCompare: (ids) => set({ selectedCompare: Array.isArray(ids) ? ids : [] }),

  // Toggle selection for comparison (up to 3 assets max)
  toggleCompare: (assetId) => set((state) => {
    const current = state.selectedCompare;
    if (current.includes(assetId)) {
      return { selectedCompare: current.filter((id) => id !== assetId) };
    }
    if (current.length >= 3) {
      toast.error("Compare up to 3 assets only.");
      return {};
    }
    return { selectedCompare: [...current, assetId] };
  })
}));