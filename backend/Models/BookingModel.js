import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PhotoPackage",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    additionalNotes: {
      type: String,
      trim: true, // Removes extra spaces
    },
  },
  {
    timestamps: true, // ✅ Automatically adds `createdAt` and `updatedAt`
  }
);

// ✅ Ensure `updatedAt` updates on modifications
bookingSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
