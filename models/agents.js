import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
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
    agency: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "https://via.placeholder.com/150", // Placeholder image URL
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
