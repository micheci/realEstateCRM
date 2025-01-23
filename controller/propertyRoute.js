import Property from "../models/properties.js";
import mongoose from "mongoose";

// Add property
export const addProperty = async (req, res) => {
  const property = req.body;

  // Ensure the agent's ID is available (from `req.user`)
  if (!req.user || !req.user._id) {
    return res
      .status(400)
      .json({ success: false, message: "Agent ID is missing from the token" });
  }

  // Validate that all required property fields are present
  if (
    !property.title ||
    !property.price ||
    !property.address ||
    !property.description
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all required property info" });
  }

  try {
    // Create a new property object, including the agent's ID
    const newProperty = new Property({
      ...property,
      agentId: req.user._id, // Use the `user._id` from the authenticated user
    });

    // Save the property to the database
    await newProperty.save();

    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error("Error in addProperty:", error.message);
    res.status(500).json({ success: false, message: "Error adding property" });
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    // Log the ID to ensure it's coming correctly from the frontend
    console.log("Received ID:", id);

    // Use new to instantiate ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Try to find and delete the property by the ObjectId
    const deletedProperty = await Property.findByIdAndDelete(objectId);
    console.log(deletedProperty, "Deleted Property");

    if (!deletedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted",
      data: deletedProperty,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting property" });
    console.error("Error in delete:", error.message);
  }
};
