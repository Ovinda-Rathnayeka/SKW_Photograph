import express from "express";
import Auth from "../Middleware/Auth.js";

const router = express.Router();

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);
router.post("/verify-otp", Auth.verifyOTP);
router.post("/logout", Auth.logout);
router.get("/me", Auth.verifyToken, Auth.profile);
router.put("/me", Auth.verifyToken, Auth.updateProfile);
export default router;
