import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import packageRoutes from "./Routes/PackageRoutes.js";
import Auth from "./Routes/AuthRoutes.js";
import Customer from "./Routes/CustomerRoutes.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/package", packageRoutes);
app.use("/auth", Auth);
app.use("/customer", Customer);

//MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
