import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent", // This references the Agent model
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, required: false },
      city: { type: String, required: true },
      state: { type: String, required: false },
      zip: { type: String, required: false },
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String, // URLs or file paths for the images
      },
    ],
    bedrooms: {
      type: Number, // Number of bedrooms in the property
      required: false,
    },
    bathrooms: {
      type: Number, // Number of bathrooms in the property
      required: false,
    },
    sqftArea: {
      type: Number, // Area of the property (in square feet or square meters)
      required: false,
    },
    yearBuild: {
      type: Number, // Area of the property (in square feet or square meters)
      required: false,
    },
    features: {
      garage: { type: Boolean, default: false },
      parkingSpaces: { type: Number, default: 0 },
      swimmingPool: { type: Boolean, default: false },
      fireplace: { type: Boolean, default: false },
      basement: { type: Boolean, default: false },
      finishedBasement: { type: Boolean, default: false },
      attic: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      remodeled: { type: Boolean, default: false },
      appliancesIncluded: { type: [String], default: [] }, // List of appliances
      outdoorSpace: { type: String, default: "" },
      securitySystem: { type: Boolean, default: false },
      smartHome: { type: Boolean, default: false },
      fence: { type: Boolean, default: false },
      hoaFees: { type: Number, default: 0 },
      petsAllowed: { type: Boolean, default: false },
      walkInClosets: { type: Boolean, default: false },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
