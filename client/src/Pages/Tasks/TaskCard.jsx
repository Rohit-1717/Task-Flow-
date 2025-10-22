import React, { useState } from "react";
import { FiEdit, FiTrash2, FiCalendar, FiMoreVertical, FiSave, FiX } from "react-icons/fi";

const TaskCard = ({
  task,
  onStatusUpdate,
  onDelete,
  onUpdate,
  getPriorityColor,
  getStatusColor,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.split('T')[0], // Format for date input
    priority: task.priority,
  });
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  const handleEdit = () => {
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
    });
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.dueDate) {
      return;
    }

    setLoading(true);
    try {
      await onUpdate(task._id, {
        title: editForm.title,
        description: editForm.description,
        dueDate: editForm.dueDate,
        priority: editForm.priority,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
    });
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await onDelete(task._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit Mode UI
  if (isEditing) {
    return (
      <div className="card bg-base-200 shadow-lg border-l-4 border-l-primary">
        <div className="card-body p-4">
          {/* Edit Header */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-primary">Editing Task</h3>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-success btn-sm gap-1"
              >
                <FiSave size={14} />
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-ghost btn-sm gap-1"
              >
                <FiX size={14} />
                Cancel
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="label py-1">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full input-sm"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Task title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="label py-1">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full textarea-sm h-20"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Task description..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Due Date */}
              <div>
                <label className="label py-1">
                  <span className="label-text font-medium">Due Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full input-sm"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="label py-1">
                  <span className="label-text font-medium">Priority</span>
                </label>
                <select
                  className="select select-bordered w-full select-sm"
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View Mode UI
  return (
    <>
      <div
        className={`card bg-base-200 shadow-lg border-l-4 ${
          task.priority === "high"
            ? "border-l-error"
            : task.priority === "medium"
            ? "border-l-warning"
            : "border-l-success"
        }`}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="card-title text-lg font-semibold line-clamp-2">
                {task.title}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={`badge badge-sm ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
                <span className={`badge badge-sm ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FiMoreVertical size={16} />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-20 w-32 p-2 shadow border"
              >
                <li>
                  <button 
                    className="text-sm justify-between"
                    onClick={handleEdit}
                  >
                    <FiEdit size={14} />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    className="text-sm text-error justify-between"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Description */}
          <p className="text-base-content/70 text-sm line-clamp-3 mb-4">
            {task.description}
          </p>

          {/* Due Date */}
          <div
            className={`flex items-center gap-2 text-sm ${
              isOverdue ? "text-error" : "text-base-content/70"
            }`}
          >
            <FiCalendar size={14} />
            <span>Due: {formatDate(task.dueDate)}</span>
            {isOverdue && (
              <span className="badge badge-error badge-sm">Overdue</span>
            )}
          </div>

          {/* Status Actions */}
          <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-300">
            <select
              className="select select-bordered select-sm"
              value={task.status}
              onChange={(e) => onStatusUpdate(task._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="text-xs text-base-content/50">
              {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete Task</h3>
            <p className="py-4">
              Are you sure you want to delete "<strong>{task.title}</strong>"? 
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className={`btn btn-error ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          
          {/* Close modal when clicking backdrop */}
          <div 
            className="modal-backdrop" 
            onClick={() => !loading && setShowDeleteModal(false)}
          ></div>
        </div>
      )}
    </>
  );
};

export default TaskCard;