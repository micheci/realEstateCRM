import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addProperty,
  deleteProperty,
  getPropertiesByAgent,
} from "../controller/propertyRoute.js";

const router = express.Router();

router.get("/", protect, getPropertiesByAgent);

router.post("/", protect, addProperty);

router.delete("/:id", protect, deleteProperty);

export default router;
