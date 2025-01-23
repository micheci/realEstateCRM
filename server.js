import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import propertyRoute from "./routes/propertyRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

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
