import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiFilter, FiSearch, FiCalendar } from "react-icons/fi";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";
import useTasksStore from "../../store/useTasksStore";

function Tasks() {
  const {
    tasks,
    loading,
    error,
    pagination,
    getTasks,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    clearError,
  } = useTasksStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    priority: "all",
    status: "all",
    search: "",
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [realTimeTotal, setRealTimeTotal] = useState(0);

  // Update real-time total whenever tasks change
  useEffect(() => {
    setRealTimeTotal(pagination.totalTasks);
  }, [pagination.totalTasks]);

  // Debounced search function
  const handleSearch = useCallback((newFilters) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      getTasks(1, 10, newFilters.search, newFilters.priority, newFilters.status);
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);
  }, [getTasks, searchTimeout]);

  // Handle filter changes with debounced search
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    handleSearch(newFilters);
  };

  // Load tasks on component mount
  useEffect(() => {
    getTasks(1, 10, filters.search, filters.priority, filters.status);
  }, [getTasks]); // Only run on mount

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowCreateModal(false);
      // Refresh tasks to include the new one
      getTasks(pagination.currentPage, 10, filters.search, filters.priority, filters.status);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  // Handle page change with current filters
  const handlePageChange = (newPage) => {
    getTasks(newPage, 10, filters.search, filters.priority, filters.status);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = { priority: "all", status: "all", search: "" };
    setFilters(clearedFilters);
    getTasks(1, 10, "", "all", "all");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "badge-error";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "in-progress":
        return "badge-warning";
      case "pending":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">My Tasks</h1>
              <p className="text-base-content/70 mt-1">
                Total Tasks: {realTimeTotal}
                {filters.search && ` matching "${filters.search}"`}
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary gap-2"
            >
              <FiPlus size={18} />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <TaskFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FiCalendar
                size={64}
                className="mx-auto text-base-content/30 mb-4"
              />
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {filters.search || filters.priority !== "all" || filters.status !== "all" 
                  ? "No tasks found" 
                  : "No tasks yet"
                }
              </h3>
              <p className="text-base-content/70 mb-6">
                {filters.search || filters.priority !== "all" || filters.status !== "all"
                  ? "Try adjusting your search or filters to see more tasks."
                  : "Get started by creating your first task!"
                }
              </p>
              {!filters.search &&
                filters.priority === "all" &&
                filters.status === "all" && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    Create Your First Task
                  </button>
                )}
              {(filters.search || filters.priority !== "all" || filters.status !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="btn btn-ghost mt-2"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    className="join-item btn"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    «
                  </button>
                  <button className="join-item btn">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </button>
                  <button
                    className="join-item btn"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        loading={loading}
      />
    </div>
  );
}

export default Tasks;