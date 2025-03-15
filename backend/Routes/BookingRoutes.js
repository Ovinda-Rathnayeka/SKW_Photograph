import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "../Controllers/BookingController.js";
const router = express.Router();

router.post("/", createBooking);

router.get("/", getAllBookings);

router.get("/:id", getBookingById);

router.put("/:id", updateBooking);

router.delete("/:id", deleteBooking);

router.put("/:id/status", updateBookingStatus);

export default router;
