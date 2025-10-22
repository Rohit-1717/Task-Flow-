import { create } from "zustand";
import axios from "axios";

const server_url = import.meta.env.VITE_SERVER_URL;
const useTasksStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
  },

  // Helper function to get auth token
  getToken: () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    return token;
  },

  // Helper function to get auth headers
  getAuthHeaders: () => {
    const token = get().getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },

  // Get all tasks with pagination
  getTasks: async (
    page = 1,
    limit = 10,
    search = "",
    priority = "all",
    status = "all"
  ) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (priority && priority !== "all") params.append("priority", priority);
      if (status && status !== "all") params.append("status", status);

      const response = await axios.get(
        `${server_url}/api/tasks?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({
        tasks: response.data.tasks,
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalTasks: response.data.totalTasks,
        },
        loading: false,
        hasSearch: response.data.hasSearch || false,
      });
    } catch (error) {
      console.error("Get Tasks Error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        set({
          error: "Session expired. Please login again.",
          loading: false,
          tasks: [],
        });
        window.location.href = "/login";
        return;
      }

      set({
        error: error.response?.data?.message || "Failed to fetch tasks",
        loading: false,
      });
    }
  },

  // Get single task
  getTaskById: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();
      const response = await axios.get(`${server_url}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ currentTask: response.data, loading: false });
    } catch (error) {
      console.error("Get Task Error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      set({
        error: error.response?.data?.message || "Failed to fetch task",
        loading: false,
      });
    }
  },

  // Create new task
  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();
      const response = await axios.post(`${server_url}/api/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        tasks: [response.data, ...state.tasks],
        pagination: {
          ...state.pagination,
          totalTasks: state.pagination.totalTasks + 1, // Update total count
          totalPages: Math.ceil((state.pagination.totalTasks + 1) / 10), // Update total pages
        },
        loading: false,
      }));

      return { success: true, task: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create task";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();
      const response = await axios.put(
        `${server_url}/api/tasks/${taskId}`,
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data : task
        ),
        currentTask:
          state.currentTask?._id === taskId ? response.data : state.currentTask,
        loading: false,
      }));

      return { success: true, task: response.data };
    } catch (error) {
      console.error(
        "Update Task Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      const errorMessage =
        error.response?.data?.message || "Failed to update task";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();
      const response = await axios.patch(
        `${server_url}/api/tasks/${taskId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data : task
        ),
        currentTask:
          state.currentTask?._id === taskId ? response.data : state.currentTask,
        loading: false,
      }));

      return { success: true, task: response.data };
    } catch (error) {
      console.error(
        "Update Status Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();
      await axios.delete(`${server_url}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        currentTask:
          state.currentTask?._id === taskId ? null : state.currentTask,
        pagination: {
          ...state.pagination,
          totalTasks: state.pagination.totalTasks - 1, // Update total count
          totalPages: Math.ceil((state.pagination.totalTasks - 1) / 10), // Update total pages
        },
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete task";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Get tasks by priority
  getTasksByPriority: async (priority) => {
    set({ loading: true, error: null });
    try {
      const token = get().getToken();
      const response = await axios.get(
        `${server_url}/api/tasks/priority/${priority}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({ tasks: response.data, loading: false });
    } catch (error) {
      console.error(
        "Get Tasks by Priority Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }

      set({
        error:
          error.response?.data?.message || "Failed to fetch tasks by priority",
        loading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current task
  clearCurrentTask: () => set({ currentTask: null }),
}));

export default useTasksStore;
