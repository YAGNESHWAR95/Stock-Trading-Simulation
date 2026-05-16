import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../components/config/baseAPI";

export const useMarket = create((set) => ({
  assets: [],
  loading: false,

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
}));