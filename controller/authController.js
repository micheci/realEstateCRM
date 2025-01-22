import Agent from "../models/agents.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register Agent
export const registerAgent = async (req, res) => {
  const { name, email, password, phone, agency } = req.body;

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
      name,
      email,
      password: hashedPassword,
      phone,
      agency,
    });

    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      token: generateToken(agent._id),
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
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        agency: agent.agency,
        profilePicture: agent.profilePicture,
      });
    } else {
      res.status(404).json({ message: "Agent not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
