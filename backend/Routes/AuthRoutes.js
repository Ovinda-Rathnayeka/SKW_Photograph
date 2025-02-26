import express from "express";
import { signup, login, logout, verifyToken } from "../Middleware/Auth.js";

const router = express.Router();


router.post("/signup", signup);


router.post("/login", login);


router.post("/logout", logout);


router.get("/profile", verifyToken, (req, res) => {
  
  res.status(200).json({ message: "User profile", customerId: req.customerId });
});

export default router;
