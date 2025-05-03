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

// ✅ Full update of all resource fields
const updateResource = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    description,
    stock,
    rentalStock,
    condition,
    availabilityStatus,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

  try {
    const updated = await Resource.findByIdAndUpdate(
      id,
      {
        name,
        category,
        description,
        stock,
        rentalStock,
        condition,
        availabilityStatus,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ message: "Failed to update resource", error });
  }
};

// ✅ Stock-only update (rename this back)
const updateResourceStockAndRentalStock = async (req, res) => {
  const { id } = req.params;
  const { stock, rentalStock } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

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

    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating stock and rentalStock:", error);
    res
      .status(500)
      .json({ message: "Error updating stock and rentalStock", error });
  }
};


// Update availability
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
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Error updating availability", error });
  }
};

// ✅ NEW: Reduce resource stock only
const reduceResourceStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID format" });
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (quantity > resource.stock) {
      return res.status(400).json({ message: "Quantity exceeds available stock" });
    }

    resource.stock -= quantity;

    if (resource.stock === 0) {
      resource.availabilityStatus = "Unavailable";
    }

    await resource.save();
    res.status(200).json(resource);
  } catch (error) {
    console.error("Error reducing resource stock:", error);
    res.status(500).json({ message: "Error reducing resource stock", error });
  }
};

export default {
  createResource,
  getResourceById,
  getAllResources,
  deleteResourceById,
  updateResource, // full resource update
  updateResourceStockAndRentalStock, // stock-only update
  updateResourceAvailability,
  reduceResourceStock,
};
