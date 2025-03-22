import Resource from "../Models/ResourceModel.js";
import mongoose from "mongoose";

// Create a new resource
const createResource = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      stock,
      rentalStock,
      condition,
      availabilityStatus,
    } = req.body;

    const newResource = new Resource({
      name,
      category,
      description,
      stock,
      rentalStock,
      condition,
      availabilityStatus,
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ message: "Error creating resource", error });
  }
};

// Get resource by ID
const getResourceById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    res.status(500).json({ message: "Error fetching resource", error });
  }
};

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching all resources:", error);
    res.status(500).json({ message: "Error fetching resources", error });
  }
};

// Delete resource by ID
const deleteResourceById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

  try {
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ message: "Resource deleted successfully!" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Error deleting resource", error });
  }
};

// Update resource stock
const updateResourceStockAndRentalStock = async (req, res) => {
  const { id } = req.params;
  const { stock, rentalStock } = req.body;

  // Validate the resource ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

  // Validate that both stock and rentalStock are numbers
  if (
    typeof stock !== "number" ||
    stock < 0 ||
    typeof rentalStock !== "number" ||
    rentalStock < 0
  ) {
    return res
      .status(400)
      .json({ message: "Invalid stock or rentalStock value" });
  }

  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { stock, rentalStock },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Return updated resource data
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating resource stock and rentalStock:", error);
    res
      .status(500)
      .json({
        message: "Error updating resource stock and rentalStock",
        error,
      });
  }
};

// Update resource availability
const updateResourceAvailability = async (req, res) => {
  const { id } = req.params;
  const { availabilityStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

  const validStatuses = ["Available", "Not Available", "Reserved"];
  if (!validStatuses.includes(availabilityStatus)) {
    return res.status(400).json({ message: "Invalid availability status" });
  }

  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { availabilityStatus },
      { new: true }
    );
    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating resource availability:", error);
    res
      .status(500)
      .json({ message: "Error updating resource availability", error });
  }
};

export default {
  createResource,
  getResourceById,
  getAllResources,
  deleteResourceById,
  updateResourceStockAndRentalStock,
  updateResourceAvailability,
};
