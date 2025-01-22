import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Property from "./models/properties.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("home page");
});

//routes
app.use("/api/auth", authRoute);

app.post("/property", async (req, res) => {
  const property = req.body;
  if (!property.title) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all info" });
  }
  const newProperty = new Property(property);
  try {
    await newProperty.save();
    res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error("Error in post");
  }
});

// Delete a property by ID
app.delete("/property/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProperty = await Property.findByIdAndDelete(id);
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
});

app.listen(5000, () => {
  connectDB();
  console.log("servier is readdy");
});

//mongo key oe4IceTviVLhFPmo
//mongodb+srv://michecimartinez:oe4IceTviVLhFPmo@crm.luvca.mongodb.net/?retryWrites=true&w=majority&appName=CRM
