import express from "express";
<<<<<<< Updated upstream
import Auth from "../Middleware/Auth.js";

const router = express.Router();

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);
router.post("/verify-otp", Auth.verifyOTP);
router.post("/logout", Auth.logout);
router.get("/me", Auth.verifyToken, Auth.profile);
=======
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
>>>>>>> Stashed changes

export default router;
