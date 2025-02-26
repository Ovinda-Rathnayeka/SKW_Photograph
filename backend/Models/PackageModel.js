import mongoose from "mongoose";

const PhotoPackageSchema = new mongoose.Schema({
  packageName: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  numberOfPhotos: { type: Number, required: true },
  photoEditing: {
    type: String,
    enum: ["Basic", "Advanced", "Premium"],
    required: true,
  },
  deliveryTime: { type: String, required: true },
  additionalServices: [{ type: String }],
  image: { type: String, required: true },
  description: { type: String },
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically update `updatedAt` before saving
PhotoPackageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PhotoPackage = mongoose.model("PhotoPackage", PhotoPackageSchema);
export default PhotoPackage;
