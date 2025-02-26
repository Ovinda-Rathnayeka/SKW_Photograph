import express from "express";
import {
  signup,
  login,
  logout,
  verifyToken,
  getProfile,
} from "../Middleware/Auth.js";

const router = express.Router();

router.post("/signup", signup); // Register new customer
router.post("/login", login); // Authenticate user
router.post("/logout", logout); // Logout user
router.get("/me", verifyToken, getProfile); // Fetch logged-in user's details

export default router;
