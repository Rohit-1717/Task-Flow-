import express from "express";
import {
  registerUser,
  loginUser,
  updateUserPassword,
  updateUserProfile,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js"; 

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, upload.single("avatar"), updateUserProfile); // Add multer for avatar upload
router.put("/password", protect, updateUserPassword);

export default router;