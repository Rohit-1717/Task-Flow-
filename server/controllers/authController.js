import User from "../models/userModel.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar:user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name } = req.body;
    const avatarFile = req.file;

    if (!name && !avatarFile) {
      return res.status(400).json({ message: "At least one field (name or avatar) is required" });
    }

    const oldAvatarPublicId = user.avatarPublicId;

    // Update name
    if (name) user.name = name;

    // Upload new avatar if provided
    if (avatarFile) {
      const uploadResult = await uploadOnCloudinary(avatarFile.path);
      if (!uploadResult) return res.status(500).json({ message: "Failed to upload avatar" });

      user.avatar = uploadResult.secure_url;
      user.avatarPublicId = uploadResult.public_id;
    }

    const updatedUser = await user.save();

    // Respond immediately
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      message: "Profile updated successfully",
      token: generateToken(updatedUser._id),
    });

    // Delete old avatar asynchronously
    if (avatarFile && oldAvatarPublicId) deleteFromCloudinary(oldAvatarPublicId);

  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};


export const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Check if new password meets requirements (optional)
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Check if new password is different from current password
    const isSamePassword = await user.matchPassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update Password Error:", error.message);
    res.status(500).json({ message: "Server error while updating password" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};
