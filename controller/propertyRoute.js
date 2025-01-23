import Property from "../models/properties.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const addProperty = async (req, res) => {
  const { title, price, street, city, state, zip, description } = req.body;

  // Combine address fields into an address object
  const address = {
    street,
    city,
    state,
    zip,
  };

  console.log(req.files, "files!"); // Log incoming files

  // Check if files are provided in the request
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload images." });
  }

  try {
    // Upload images to Cloudinary
    const imageUrls = [];
    for (let i = 0; i < req.files.length; i++) {
      const image = req.files[i];

      // Upload each image buffer to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto", // Automatically detect the file type
      });

      imageUrls.push(uploadedImage.secure_url); // Push the Cloudinary URL to the array
    }

    console.log(imageUrls, "imageUrls!"); // Log the final imageUrls array

    // Validate required fields
    if (!title || !price || !address || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required property info",
      });
    }

    // Create and save the new property
    const newProperty = new Property({
      title,
      price,
      address,
      description,
      images: imageUrls, // Store Cloudinary URLs
      agentId: req.user._id, // Agent ID from token
    });

    // Save the property
    await newProperty.save();

    console.log(newProperty, "newProperty!"); // Log the newly created property

    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
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

export const getPropertiesByAgent = async (req, res) => {
  try {
    // The agentId is extracted from the middleware
    const agentId = req.user._id;

    // Query the database to find properties that match the agentId
    const properties = await Property.find({ agentId });

    // Check if the agent has any properties
    if (!properties || properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found for this agent",
      });
    }

    // Return the properties
    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
    });
  }
};

export const editPropertyDetails = async (req, res) => {
  const { id } = req.params;

  const updates = {}; // Object to store the updates

  // Step 1: Ensure the property exists
  const existingProperty = await Property.findById(id);
  if (!existingProperty) {
    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }

  // Step 2: Handle non-file fields (price, description, address)
  if (req.body.price) {
    updates.price = req.body.price;
  }

  if (req.body.description) {
    updates.description = req.body.description;
  }

  // Handle address update
  if (req.body.address) {
    const existingAddress = existingProperty.address || {};
    const updatedAddress = {
      street: req.body.address.street || existingAddress.street,
      city: req.body.address.city || existingAddress.city,
      state: req.body.address.state || existingAddress.state,
      zip: req.body.address.zip || existingAddress.zip,
    };

    updates.address = updatedAddress; // Update the address field
  }

  // Step 3: Update the property with the new values
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: updates }, // Apply the updates
      { new: true, runValidators: true } // Get the updated document and validate
    );

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Respond with success and updated property data
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({
      success: false,
      message: "Error updating property",
    });
  }
};
