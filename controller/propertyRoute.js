import Property from "../models/properties.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const addProperty = async (req, res) => {
  const {
    title,
    price,
    description,
    address,
    bedrooms,
    bathrooms,
    area,
    garage,
    parkingSpaces,
    swimmingPool,
    fireplace,
    basement,
    attic,
    airConditioning,
    remodeled,
    outdoorSpace,
    securitySystem,
    smartHome,
    fence,
    hoaFees,
    petsAllowed,
    walkInClosets,
  } = req.body;

  // Combine address fields

  console.log(req.files, "files!"); // Log incoming files
  console.log(req.body, "body");
  // Check if files are provided in the request
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    try {
      for (let i = 0; i < req.files.length; i++) {
        const image = req.files[i];

        // Upload each image buffer to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image.path, {
          resource_type: "auto",
        });

        imageUrls.push(uploadedImage.secure_url);
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading images",
      });
    }
  }

  try {
    // Create and save the new property
    const newProperty = new Property({
      title,
      price,
      address,
      description,
      bedrooms,
      bathrooms,
      area,
      garage,
      parkingSpaces,
      swimmingPool,
      fireplace,
      basement,
      attic,
      airConditioning,
      remodeled,
      outdoorSpace,
      securitySystem,
      smartHome,
      fence,
      hoaFees,
      petsAllowed,
      walkInClosets,
      images: imageUrls, // Store Cloudinary URLs
      agentId: req.user._id, // Agent ID from token
    });

    await newProperty.save();

    console.log(newProperty, "newProperty!"); // Log the newly created property

    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error("Error saving property:", error);
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
  console.log(req.body, "INSERVER");
  // Step 1: Ensure the property exists
  const existingProperty = await Property.findById(id);
  if (!existingProperty) {
    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: req.body }, // Apply the updates
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

export const getPropertyByID = async (req, res) => {
  try {
    const agentId = req.user._id; // Extract agent ID from middleware
    const { propertyID } = req.params; // Get property ID from request params

    // Find the specific property that belongs to the agent
    const property = await Property.findOne({ _id: propertyID, agentId });
    console.log(property, "found property in backend");
    // If no property is found, return a 404 response
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or does not belong to this agent",
      });
    }

    // Return the property
    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching property:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching property",
    });
  }
};

export const uploadPropertyImages = async (req, res) => {
  const { id } = req.params;
  const existingProperty = await Property.findById(id);
  if (!existingProperty) {
    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }

  console.log(req.files);

  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No images uploaded",
    });
  }

  const uploadedImageUrls = [];
  console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Exists" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Exists" : "Missing",
  });

  try {
    for (let index = 0; index < req.files.length; index++) {
      const image = req.files[index];
      console.log(
        `Uploading image ${index + 1}... Buffer size: ${image.buffer.length}`
      );

      // Convert image buffer to base64
      const base64Image = `data:${
        image.mimetype
      };base64,${image.buffer.toString("base64")}`;

      // Upload directly with async/await
      const result = await cloudinary.uploader.upload(base64Image, {
        resource_type: "image",
      });

      if (result && result.secure_url) {
        console.log(
          `Image ${index + 1} uploaded successfully: ${result.secure_url}`
        );
        uploadedImageUrls.push(result.secure_url);
      } else {
        console.error(`No result from Cloudinary for image ${index + 1}`);
      }
    }

    console.log("All images uploaded successfully!");

    // Add new image URLs to the property images array
    existingProperty.images.push(...uploadedImageUrls);
    await existingProperty.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: existingProperty, // Optionally, return the updated property
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading images",
    });
  }
};

//67989c5ce2d22574df770635
