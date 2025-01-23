import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
  addProperty,
  deleteProperty,
  getPropertiesByAgent,
  editPropertyDetails,
} from "../controller/propertyRoute.js";

const router = express.Router();

router.get("/", protect, getPropertiesByAgent);

router.post("/", protect, upload.array("images[]"), addProperty);

router.patch("/:id", protect, editPropertyDetails);

router.delete("/:id", protect, deleteProperty);

export default router;
