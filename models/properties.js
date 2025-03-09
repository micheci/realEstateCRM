import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent", // References the Agent model
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address: { type: String, required: true },

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
      type: Number,
      required: false,
    },
    bathrooms: {
      type: Number,
      required: false,
    },
    sqftArea: {
      type: Number,
      required: false,
    },
    yearBuild: {
      type: Number,
      required: false,
    },

    // Flattened features
    garage: { type: Boolean, default: false },
    parkingSpaces: { type: Number, default: 0 },
    swimmingPool: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    basement: { type: Boolean, default: false },
    finishedBasement: { type: Boolean, default: false },
    attic: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    remodeled: { type: Boolean, default: false },
    outdoorSpace: { type: String, default: "" },
    securitySystem: { type: Boolean, default: false },
    smartHome: { type: Boolean, default: false },
    fence: { type: Boolean, default: false },
    hoaFees: { type: Number, default: 0 },
    petsAllowed: { type: Boolean, default: false },
    walkInClosets: { type: Boolean, default: false },

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
