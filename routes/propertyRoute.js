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
  getFeaturedPropertiesFromSlug,
  getAllPropertiesFromSlug,
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

// Client facing endpoints(dont need protect/auth) //

//get featured property set by the agent
router.get("/featured/:slug", getFeaturedPropertiesFromSlug);
//get all agents properties(no protected route since front will let guest view page)
router.get("/agent/:slug", getAllPropertiesFromSlug);

export default router;
