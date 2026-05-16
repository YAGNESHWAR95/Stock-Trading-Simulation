import { create } from "zustand";
import axios from "axios";
import BASE_URL from "../components/config/baseAPI";

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (userCreds) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${BASE_URL}/auth-api/login`, userCreds, {
        withCredentials: true,
      });
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.error || "Login Failed" });
    }
  },

  logout: async () => {
    try {
      await axios.get(`${BASE_URL}/auth-api/logout`, { withCredentials: true });
      set({ isAuthenticated: false, currentUser: null });
    } catch (err) {
      console.error(err);
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth-api/check-auth`, { withCredentials: true });
      set({ currentUser: res.data.payload, isAuthenticated: true });
    } catch (err) {
      set({ currentUser: null, isAuthenticated: false });
    }
  },

  updateWalletBalance: (newBalance) =>
    set((state) => ({
      currentUser: { ...state.currentUser, walletBalance: newBalance },
    })),
}));