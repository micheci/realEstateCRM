import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    agencyName: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "https://via.placeholder.com/150", // Placeholder image URL
    },
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false, // Allows marking agents as admins if necessary
    },
  },
  { timestamps: true }
);

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
