import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import packageRoutes from "./Routes/PackageRoutes.js";
import Auth from "./Routes/AuthRoutes.js";
import Customer from "./Routes/CustomerRoutes.js";
import Booking from "./Routes/BookingRoutes.js";
import cookieParser from "cookie-parser";
import Payment from "./Routes/PaymentRoutes.js";
import Employee from "./Routes/EmployeeRoute.js";
import Feedback from "./Routes/FeedbackRoute.js";
import Product from "./Routes/ProductRoutes.js";
import Cart from "./Routes/CartRoutes.js";

import cloudinary from "./Middleware/CloudinaryConfig.js";
import Employee from "./Routes/EmployeeRoute.js";

import Rental from "./Routes/RentalRoutes.js";
import Resource from "./Routes/ResourceRoutes.js";
import CustomizePackage from "./Routes/CustomizePackageRoute.js";

const app = express();
dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/package", packageRoutes);
app.use("/auth", Auth);
app.use("/customer", Customer);
app.use("/booking", Booking);
app.use("/payment", Payment);
app.use("/employee", Employee);
app.use("/feedbacks", Feedback);
app.use("/product", Product);
app.use("/cart", Cart);
app.use("/employee", Employee);
app.use("/rental", Rental);
app.use("/resource", Resource);
app.use("/customization", CustomizePackage);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

cloudinary.api
  .ping()
  .then(() => {
    console.log("Cloudinary connection successful!");
  })
  .catch((error) => {
    console.error("Cloudinary connection failed:", error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
