import { create } from "zustand";

const useTheme = create((set) => ({
  isAuth: false,
  user: null,
  theme: localStorage.getItem("theme") || "light",

  login: (user) => set({ isAuth: true, user }),
  logout: () => set({ isAuth: false, user: null }),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));

export default useTheme;
