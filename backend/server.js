import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import packageRoutes from "./Routes/PackageRoutes.js";
import Auth from "./Routes/AuthRoutes.js";
import Customer from "./Routes/CustomerRoutes.js";
import Booking from "./Routes/BookingRoutes.js";
import cookieParser from "cookie-parser";
<<<<<<< Updated upstream
import Payment from "./Routes/PaymentRoutes.js";

import cloudinary from "./Middleware/CloudinaryConfig.js";
=======
>>>>>>> Stashed changes

const app = express();
dotenv.config();
app.use(cookieParser());
app.use(
  cors({
<<<<<<< Updated upstream
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

=======
    origin: "http://localhost:3000",
    credentials: true,
  })
);
>>>>>>> Stashed changes
app.use(express.json());

app.use("/package", packageRoutes);
app.use("/auth", Auth);
app.use("/customer", Customer);
app.use("/booking", Booking);
<<<<<<< Updated upstream
app.use("/payment", Payment);
=======
>>>>>>> Stashed changes

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

<<<<<<< Updated upstream
cloudinary.api
  .ping()
  .then(() => {
    console.log("Cloudinary connection successful!");
  })
  .catch((error) => {
    console.error("Cloudinary connection failed:", error);
  });
=======
app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});
>>>>>>> Stashed changes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
