import { create } from "zustand";
import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuth: false,
  setUser: (user) => set({ user }),
  isInitialized: false, // NEW: Track if auth initialization is complete

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${server_url}/api/auth/login`, {
        email,
        password,
      });

      if (!response.data?.token)
        throw new Error("Invalid response from server");

      const { _id, name, email: userEmail, avatar, token } = response.data;

      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id, name, email: userEmail, avatar })
      );

      set({
        user: { _id, name, email: userEmail, avatar },
        token,
        isAuth: true,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      set({
        error: errorMessage,
        loading: false,
        isAuth: false,
        user: null,
        token: null,
      });
      throw new Error(errorMessage);
    }
  },

  // Register
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${server_url}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (!response.data?.token)
        throw new Error("Registration failed - no token received");

      const { _id, name: userName, email: userEmail, token } = response.data;

      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id, name: userName, email: userEmail })
      );

      set({
        user: { _id, name: userName, email: userEmail },
        token,
        isAuth: true,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      set({
        error: errorMessage,
        loading: false,
        isAuth: false,
        user: null,
        token: null,
      });
      throw new Error(errorMessage);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuth: false,
      error: null,
      isInitialized: true,
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Fetch current user
  fetchCurrentUser: async () => {
    const token = get().token || localStorage.getItem("authToken");
    if (!token) {
      set({ isInitialized: true });
      return null;
    }

    try {
      const response = await axios.get(`${server_url}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        // Update localStorage with fresh user data
        localStorage.setItem("user", JSON.stringify(response.data));
        set({
          user: response.data,
          isAuth: true,
          isInitialized: true,
        });
      }
      return response.data;
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      // Clear invalid token
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuth: false,
        isInitialized: true,
      });
      return null;
    }
  },

  // Initialize auth - FIXED: Now properly handles loading state
  init: async () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        // Set initial state from localStorage immediately
        const user = JSON.parse(userData);
        set({
          user,
          token,
          isAuth: true,
          loading: true, // Set loading true while we verify with server
        });

        // Verify token with server
        await get().fetchCurrentUser();
        set({ loading: false });
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        set({
          user: null,
          token: null,
          isAuth: false,
          loading: false,
          isInitialized: true,
        });
      }
    } else {
      // No token found, auth initialization complete
      set({ isInitialized: true });
    }
  },

  // Update Profile (name + avatar)
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
      const { data } = await axios.put(
        `${server_url}/api/auth/profile`,
        formData,
        config
      );

      // Update store and localStorage
      localStorage.setItem("user", JSON.stringify(data));
      set({ user: data, loading: false });

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update Password
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
        `${server_url}/api/auth/password`,
        { currentPassword, newPassword },
        config
      );

      set({ loading: false });
      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
}));

export default useAuthStore;
