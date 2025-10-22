import React from "react";
import { FiSearch, FiFilter } from "react-icons/fi";

const TaskFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="label">
            <span className="label-text font-medium">Search Tasks</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or description..."
              className="input input-bordered w-full pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <FiSearch
              className="absolute left-3 top-3 text-base-content/50"
              size={18}
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Priority</span>
          </label>
          <select
            className="select select-bordered"
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Status</span>
          </label>
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.priority !== "all" ||
          filters.status !== "all" ||
          filters.search) && (
          <button
            className="btn btn-ghost"
            onClick={() =>
              onFiltersChange({ priority: "all", status: "all", search: "" })
            }
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
