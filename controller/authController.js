import Agent from "../models/agents.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register Agent
export const registerAgent = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    agencyName,
    website,
    licenseNumber,
    profilePicture,
    facebook,
    instagram,
    linkedin,
  } = req.body;
  try {
    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
      return res.status(400).json({ message: "Agent already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the agent
    const agent = await Agent.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      agencyName,
      website,
      licenseNumber,
      profilePicture: profilePicture || "https://via.placeholder.com/150", // Default profile picture
      facebook,
      instagram,
      linkedin,
      isActive: true, // Set to true or false based on your logic
    });

    res.status(201).json({
      _id: agent._id,
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone,
      agencyName: agent.agencyName,
      profilePicture: agent.profilePicture,
      facebook: agent.facebook,
      instagram: agent.instagram,
      linkedin: agent.linkedin,
      isActive: agent.isActive,
      token: generateToken(agent._id), // Assuming generateToken function exists
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering agent", error: error.message }); // Include the error message in the response
  }
};

// Login Agent
export const loginAgent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      token: generateToken(agent._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get Agent Profile
export const getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.id);

    if (agent) {
      res.status(200).json({
        _id: agent._id,
        fullName: agent.fullName,
        email: agent.email,
        phone: agent.phone,
        agencyName: agent.agencyName,
        website: agent.website,
        licenseNumber: agent.licenseNumber,
        profilePicture: agent.profilePicture,
        facebook: agent.facebook,
        instagram: agent.instagram,
        linkedin: agent.linkedin,
        isActive: agent.isActive,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      });
    } else {
      res.status(404).json({ message: "Agent not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// update agent profile
export const editAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Ensure frontend and backend field names match
    agent.fullName = req.body.fullName;
    agent.email = req.body.email;
    agent.phone = req.body.phone;
    agent.agency = req.body.agencyName;
    agent.website = req.body.website;
    agent.licenseNumber = req.body.licenseNumber;
    agent.facebook = req.body.facebook;
    agent.instagram = req.body.instagram;
    agent.linkedin = req.body.linkedin;
    const updatedAgent = await agent.save();

    res.status(200).json({
      _id: updatedAgent._id,
      fullName: updatedAgent.name,
      email: updatedAgent.email,
      profilePicture: agent.profilePicture,
      phone: updatedAgent.phone,
      agency: updatedAgent.agency,
      website: updatedAgent.website,
      licenseNumber: updatedAgent.licenseNumber,
      facebook: updatedAgent.facebook,
      instagram: updatedAgent.instagram,
      linkedin: updatedAgent.linkedin,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// uploading profile Picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const agent = await Agent.findById(req.user._id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert memory buffer to base64 for Cloudinary
    const base64Image = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pictures",
      resource_type: "image",
    });

    // Save image URL in database
    agent.profilePicture = uploadedImage.secure_url;
    await agent.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      imageUrl: uploadedImage.secure_url,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile picture",
    });
  }
};
