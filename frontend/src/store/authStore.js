import { create } from "zustand";
import baseAPI from "../components/config/baseAPI";

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // LOGIN
  login: async (userCreds) => {
    try {
      set({ loading: true, error: null });

      const res = await baseAPI.post("/api/auth/login", userCreds);

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
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

  // LOGOUT
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

  // CHECK AUTH SESSION
  checkAuth: async () => {
    try {
      const res = await baseAPI.get("/api/auth/check-auth");

      set({
        currentUser: res.data.user || res.data.payload,
        isAuthenticated: true,
      });
    } catch (err) {
      set({
        currentUser: null,
        isAuthenticated: false,
      });
    }
  },
}));