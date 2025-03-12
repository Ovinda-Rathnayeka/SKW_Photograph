import React, { useState, useEffect } from "react";
import { getAllPackages, deletePackageById, updatePackageById } from "../API/PackageAPI.js"; // Adjust paths if necessary

function PackageDisplay() {
  const [packages, setPackages] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [updatedPackageData, setUpdatedPackageData] = useState({
    packageName: "",
    category: "",
    price: "",
    duration: "",
    numberOfPhotos: "",
    photoEditing: "Basic", // Default value
    deliveryTime: "",
    additionalServices: "",
    description: "",
    image: null, // Store image for preview
  });

  // Fetch all packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAllPackages();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  // Handle delete package
  const handleDelete = async (id) => {
    try {
      await deletePackageById(id);
      setPackages(packages.filter((pkg) => pkg._id !== id)); // Remove deleted package from the state
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  // Open the popup form with the selected package data
  const handleUpdate = (pkg) => {
    setSelectedPackage(pkg);
    setUpdatedPackageData({
      packageName: pkg.packageName,
      category: pkg.category,
      price: pkg.price,
      duration: pkg.duration,
      numberOfPhotos: pkg.numberOfPhotos,
      photoEditing: pkg.photoEditing,
      deliveryTime: pkg.deliveryTime,
      additionalServices: pkg.additionalServices.join(", "),
      description: pkg.description,
      image: pkg.image, // Set the existing image for preview
    });
    setIsPopupOpen(true);
  };

  // Handle change in the update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPackageData({ ...updatedPackageData, [name]: value });
  };

  // Handle image file change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedPackageData({ ...updatedPackageData, image: URL.createObjectURL(file) }); // Preview the image
  };

  // Handle update form submission
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedPackage = await updatePackageById(selectedPackage._id, updatedPackageData);
      setPackages(
        packages.map((pkg) =>
          pkg._id === selectedPackage._id ? updatedPackage : pkg
        )
      );
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Packages</h1>

      {/* Packages List */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Package Name</th>
            <th className="px-4 py-2 border-b">Category</th>
            <th className="px-4 py-2 border-b">Price</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id}>
              <td className="px-4 py-2 border-b">{pkg.packageName}</td>
              <td className="px-4 py-2 border-b">{pkg.category}</td>
              <td className="px-4 py-2 border-b">{pkg.price}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleUpdate(pkg)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Form for Updating Package */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Update Package</h2>
            <form onSubmit={handleSubmitUpdate}>
              {/* Package Name */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Package Name</label>
                <input
                  type="text"
                  name="packageName"
                  value={updatedPackageData.packageName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={updatedPackageData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={updatedPackageData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={updatedPackageData.duration}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Number of Photos */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Number of Photos</label>
                <input
                  type="number"
                  name="numberOfPhotos"
                  value={updatedPackageData.numberOfPhotos}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Additional Services */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Additional Services</label>
                <input
                  type="text"
                  name="additionalServices"
                  value={updatedPackageData.additionalServices}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Image Preview */}
              {updatedPackageData.image && (
                <div className="mb-4">
                  <label className="block text-lg mb-2">Current Image</label>
                  <img
                    src={updatedPackageData.image}
                    alt="Package Preview"
                    className="w-full h-48 object-cover border border-gray-300 rounded-md"
                  />
                </div>
              )}

              {/* Upload New Image */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Upload New Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-lg mb-2">Description</label>
                <textarea
                  name="description"
                  value={updatedPackageData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Update Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageDisplay;
