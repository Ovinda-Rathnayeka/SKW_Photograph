import express from "express";
import {
  signup,
  login,
  logout,
  verifyToken,
  getProfile,
} from "../Middleware/Auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getProfile);

export default router;
