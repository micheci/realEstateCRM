import express from "express";
import {
  registerAgent,
  loginAgent,
  getAgentProfile,
  editAgentProfile,
  uploadProfilePicture,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js"; // Multer middleware

const router = express.Router();

// Public Routes
router.post("/register", registerAgent);
router.post("/login", loginAgent);

// Protected Route
router.get("/profile", protect, getAgentProfile);
router.put("/profile", protect, editAgentProfile);

//profile pic upload
router.post(
  "/profile/upload-profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);

export default router;
