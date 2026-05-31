import { create } from "zustand";

export const useTheme = create((set) => ({
  theme: localStorage.getItem("tradepro.theme") || "dark",
  
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("tradepro.theme", nextTheme);
    
    // Apply theme class to documentElement for global tailwind / standard CSS selectors
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    
    return { theme: nextTheme };
  }),
  
  initTheme: () => {
    const savedTheme = localStorage.getItem("tradepro.theme") || "dark";
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }
}));
