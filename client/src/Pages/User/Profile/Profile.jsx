import React, { useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuthStore();

  // Local state for inputs
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // selected file
  const [avatarPreview, setAvatarPreview] = useState(""); // preview URL
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Sync local state when Zustand user changes
  useEffect(() => {
    setName(user?.name || "");
    setAvatarPreview(user?.avatar || "");
  }, [user]);

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile);

      await updateProfile(formData); // updates Zustand store

      setMessage("Profile updated successfully!");
      setAvatarFile(null); // reset file input
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
    }

    setLoading(false);
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await updatePassword(currentPassword, newPassword);
      setMessage(data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.message || "Failed to update password");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-18">
      <h1 className="text-3xl font-bold text-primary mb-6">Profile</h1>

      {message && (
        <div className="alert alert-info mb-4 shadow-lg">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Update Card */}
        <div className="card bg-base-200 shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full border overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-xl font-bold bg-primary text-primary-content">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-sm"
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Password Update Card */}
        <div className="card bg-base-200 shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="relative">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-xl"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <div className="relative">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-xl"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
