import Property from "../models/properties.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const addProperty = async (req, res) => {
  const {
    title,
    price,
    street,
    city,
    state,
    zip,
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
    appliancesIncluded,
    outdoorSpace,
    securitySystem,
    smartHome,
    fence,
    hoaFees,
    petsAllowed,
    walkInClosets,
  } = req.body;

  // Combine address fields
  const address = { street, city, state, zip };

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

  // Validate required fields
  if (!title || !price || !address || !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required property info",
    });
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
      parkingSpaces: parkingSpaces || null, // Handle empty values
      swimmingPool,
      fireplace,
      basement,
      attic,
      airConditioning,
      remodeled,
      appliancesIncluded: appliancesIncluded || [], // Default to empty array
      outdoorSpace: outdoorSpace || null,
      securitySystem,
      smartHome,
      fence,
      hoaFees: hoaFees || null,
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
  console.log(req.files, "AYUDAME");
  // Step 1: Ensure the property exists
  const existingProperty = await Property.findById(id);
  if (!existingProperty) {
    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }

  // Step 2: Handle non-file fields (price, description, address, etc.)
  if (req.body.price) {
    updates.price = req.body.price;
  }

  if (req.body.description) {
    updates.description = req.body.description;
  }

  if (req.body.bedrooms) {
    updates.bedrooms = req.body.bedrooms;
  }

  if (req.body.bathrooms) {
    updates.bathrooms = req.body.bathrooms;
  }

  if (req.body.area) {
    updates.area = req.body.area;
  }

  if (req.body.features) {
    updates.features = JSON.parse(req.body.features); // Assuming it's sent as a JSON string
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

  // Step 3: Handle images (new and removed)
  let imageUrls = existingProperty.images || [];

  // Check if new images are provided
  if (req.files && req.files.images) {
    const newImageUrls = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const image = req.files.images[i];

      // Upload each new image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto", // Automatically detect the file type
      });

      newImageUrls.push(uploadedImage.secure_url); // Push the Cloudinary URL to the array
    }

    // Merge new images with existing ones
    imageUrls = [...imageUrls, ...newImageUrls];
    updates.images = imageUrls; // Update images field with new URLs
  }

  // Step 4: Update the property with the new values
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

export const getPropertyByID = async (req, res) => {
  try {
    const agentId = req.user._id; // Extract agent ID from middleware
    const { propertyID } = req.params; // Get property ID from request params

    // Find the specific property that belongs to the agent
    const property = await Property.findOne({ _id: propertyID, agentId });

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
