import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuth: false,

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (!response.data?.token) throw new Error("Invalid response from server");

      const { _id, name, email: userEmail,  avatar,token } = response.data;
      set({ user: { _id, name, email: userEmail, avatar }, token, isAuth: true, loading: false, error: null });
      localStorage.setItem("authToken", token);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      set({ error: errorMessage, loading: false, isAuth: false, user: null, token: null });
      throw new Error(errorMessage);
    }
  },

  // Register
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      if (!response.data?.token) throw new Error("Registration failed - no token received");

      const { _id, name: userName, email: userEmail, token } = response.data;
      set({ user: { _id, name: userName, email: userEmail }, token, isAuth: true, loading: false, error: null });
      localStorage.setItem("authToken", token);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      set({ error: errorMessage, loading: false, isAuth: false, user: null, token: null });
      throw new Error(errorMessage);
    }
  },

  // Logout
  logout: () => {
    set({ user: null, token: null, isAuth: false, error: null });
    localStorage.removeItem("authToken");
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Fetch current user
  fetchCurrentUser: async () => {
    const token = get().token || localStorage.getItem("authToken");
    if (!token) return set({ user: null, isAuth: false });

    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) set({ user: response.data, isAuth: true });
      return response.data;
    } catch (err) {
      localStorage.removeItem("authToken");
      set({ user: null, token: null, isAuth: false });
      return null;
    }
  },

  // Initialize auth
  init: async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      set({ token, isAuth: true, loading: true });
      const user = await get().fetchCurrentUser();
      if (!user) localStorage.removeItem("authToken");
      set({ loading: false });
    } else set({ loading: false });
  },

  // ---------------------------
  // NEW: Update Profile (name + avatar)
  // ---------------------------
  updateProfile: async (formData) => {
    set({ loading: true, error: null });
    const token = get().token;
    if (!token) throw new Error("Not authenticated");

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put("http://localhost:5000/api/auth/profile", formData, config);

      // Update store
      set({ user: data, loading: false });
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update profile";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // ---------------------------
  // NEW: Update Password
  // ---------------------------
  updatePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    const token = get().token;
    if (!token) throw new Error("Not authenticated");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/password",
        { currentPassword, newPassword },
        config
      );

      set({ loading: false });
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update password";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
}));

export default useAuthStore;
