import { create } from "zustand";
import baseAPI from "../components/config/baseAPI";

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  isCheckingAuth: true, // 👈 Initialized as true so page refreshes trigger the loading screen immediately
  error: null,

  // 1. LOGIN
  login: async (userCreds) => {
    try {
      set({ loading: true, error: null });

      const res = await baseAPI.post("/api/auth/login", userCreds);

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload || res.data.user || res.data,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Login Failed",
      });
    }
  },

  // 2. LOGOUT
  logout: async () => {
    try {
      await baseAPI.post("/api/auth/logout");

      set({
        currentUser: null,
        isAuthenticated: false,
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },

  // 3. CHECK AUTH SESSION (Persists the user on page refresh)
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      
      const res = await baseAPI.get("/api/auth/check-auth");
      const user = res.data.user || res.data.payload || res.data;

      set({
        currentUser: user,
        isAuthenticated: !!user, // Flips to true if user object is valid
        isCheckingAuth: false,  // 👈 Let ProtectedRoute know verification is complete
      });
    } catch (err) {
      console.error("Session restoration check failed:", err.message);
      set({
        currentUser: null,
        isAuthenticated: false,
        isCheckingAuth: false,  // 👈 Turn off loading state even if no valid cookie token exists
      });
    }
  },

  // 4. UPDATE WALLET BALANCE (Keeps header/sidebar synchronized in real time)
  updateWalletBalance: (newBalance) => {
    set((state) => {
      if (!state.currentUser) return state; // Safety guard if no user profile is active
      
      return {
        currentUser: {
          ...state.currentUser,
          walletBalance: Number(newBalance), // Enforce numeric type formatting
        },
      };
    });
  },
}));