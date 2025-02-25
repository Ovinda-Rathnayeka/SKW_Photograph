import PhotoPackage from "../Models/PackageModel.js";

// Create a new photo package
const createPackage = async (req, res) => {
  try {
    const newPackage = new PhotoPackage(req.body);
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all photo packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await PhotoPackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get photo package by ID
const getPackageById = async (req, res) => {
  try {
    const packageData = await PhotoPackage.findById(req.params.id);
    if (!packageData)
      return res.status(404).json({ message: "Package not found" });
    res.status(200).json(packageData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update photo package by ID
const updatePackageById = async (req, res) => {
  try {
    const updatedPackage = await PhotoPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPackage)
      return res.status(404).json({ message: "Package not found" });
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete photo package by ID
const deletePackageById = async (req, res) => {
  try {
    const deletedPackage = await PhotoPackage.findByIdAndDelete(req.params.id);
    if (!deletedPackage)
      return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackageById,
  deletePackageById,
};
