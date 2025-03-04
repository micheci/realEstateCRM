import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import {
  addProperty,
  deleteProperty,
  getPropertiesByAgent,
  editPropertyDetails,
  getPropertyByID,
  uploadPropertyImages,
} from "../controller/propertyRoute.js";

const router = express.Router();

router.get("/", protect, getPropertiesByAgent);

router.get("/:propertyID", protect, getPropertyByID);

router.post("/", protect, upload.array("images"), addProperty);

router.patch("/:id", protect, editPropertyDetails);
router.patch(
  "/images/:id",
  protect,
  upload.array("images"),
  uploadPropertyImages
);

router.delete("/:id", protect, deleteProperty);

export default router;
