import Customer from "../Models/CustomerModel.js"; 
import CustomizePackage from "../Models/CustomizePackageModel.js"; 

export const createCustomizePackage = async (req, res) => {
  try {
    const {
      customerId,
      serviceType,
      eventType,
      date,
      startTime,
      durationHours,
      location,
      address,
      packageType,
      count,
      transportRequired,
      additionalRequests,
      totalPrice,
    } = req.body;

    
    if (
      !customerId ||
      !serviceType ||
      !eventType ||
      !date ||
      !startTime ||
      !durationHours ||
      !location ||
      !address ||
      !packageType ||
      !count ||
      transportRequired === undefined ||
      totalPrice === undefined
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    
    const customerExists = await Customer.findById(customerId);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    
    const newPackage = new CustomizePackage({
      customerId,
      serviceType,
      eventType,
      date,
      startTime,
      durationHours,
      location,
      address,
      packageType,
      count,
      transportRequired,
      additionalRequests,
      totalPrice,
    });

    
    const savedPackage = await newPackage.save();

   
    res.status(201).json(savedPackage);
  } catch (err) {
    console.error("Error creating package:", err);
    res
      .status(500)
      .json({ message: "Error creating package", error: err.message });
  }
};


export const getAllPackages = async (req, res) => {
  try {
    const packages = await CustomizePackage.find().sort({ createdAt: -1 });
    res.status(200).json(packages);
  } catch (err) {
    console.error("Error fetching packages:", err);
    res
      .status(500)
      .json({ message: "Error retrieving packages", error: err.message });
  }
};


export const getPackageById = async (req, res) => {
  try {
    const pack = await CustomizePackage.findById(req.params.id);
    if (!pack) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(pack);
  } catch (err) {
    console.error("Error fetching package:", err);
    res
      .status(500)
      .json({ message: "Error retrieving package", error: err.message });
  }
};


export const updatePackage = async (req, res) => {
  try {
    const updated = await CustomizePackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating package:", err);
    res
      .status(500)
      .json({ message: "Error updating package", error: err.message });
  }
};


export const deletePackage = async (req, res) => {
  try {
    await CustomizePackage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Error deleting package:", err);
    res
      .status(500)
      .json({ message: "Error deleting package", error: err.message });
  }
};
