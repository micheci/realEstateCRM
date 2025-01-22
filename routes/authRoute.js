import express from "express";
import {
  registerAgent,
  loginAgent,
  getAgentProfile,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerAgent);
router.post("/login", loginAgent);

// Protected Route
router.get("/profile", protect, getAgentProfile);

export default router;
