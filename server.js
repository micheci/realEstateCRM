import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import propertyRoute from "./routes/propertyRoute.js";
import cors from "cors"; // Importing CORS using ES Module syntax

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("home page");
});

//routes
app.use("/api/auth", authRoute);
app.use("/api/property", propertyRoute);

app.listen(5000, () => {
  connectDB();
  console.log("servier is readdy");
});

//ideas for agent CRM
//change logo,theme,color text
//proprty grupoing? newlistings,for rent,luxery
//lead management (clients interested in properties,trak lead status(interested,signed))
//anaylystics

//dashboard
//properties
//leads
//website settings
//anayltics
//profile
