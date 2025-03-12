import React, { useState } from "react";
import { createPackage } from "../API/PackageAPI.js";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa"; // Upload & Success Icon

function PackageAdd() {
  const [packageData, setPackageData] = useState({
    packageName: "",
    category: "",
    price: "",
    duration: "",
    numberOfPhotos: "",
    photoEditing: "Basic",
    deliveryTime: "",
    additionalServices: [],
    description: "",
    image: null,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData({ ...packageData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleServiceChange = (e) => {
    setPackageData({
      ...packageData,
      additionalServices: e.target.value.split(",").map((service) => service.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPackage(packageData, image);
      setShowSuccessModal(true);
      setPackageData({
        packageName: "",
        category: "",
        price: "",
        duration: "",
        numberOfPhotos: "",
        photoEditing: "Basic",
        deliveryTime: "",
        additionalServices: [],
        description: "",
        image: null,
      });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Error creating package.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        📦 Create New Package
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Package Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Package Name" name="packageName" value={packageData.packageName} onChange={handleChange} />
          <InputField label="Category" name="category" value={packageData.category} onChange={handleChange} />
          <InputField label="Price ($)" name="price" type="number" value={packageData.price} onChange={handleChange} />
          <InputField label="Duration" name="duration" value={packageData.duration} onChange={handleChange} />
          <InputField label="Number of Photos" name="numberOfPhotos" type="number" value={packageData.numberOfPhotos} onChange={handleChange} />
          <InputField label="Delivery Time" name="deliveryTime" value={packageData.deliveryTime} onChange={handleChange} />
        </div>

        {/* Photo Editing */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Photo Editing</label>
          <select
            name="photoEditing"
            value={packageData.photoEditing}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="Basic">Basic</option>
            <option value="Advanced">Advanced</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Additional Services */}
        <InputField label="Additional Services (comma-separated)" name="additionalServices" value={packageData.additionalServices.join(", ")} onChange={handleServiceChange} />

        {/* Description */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={packageData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter package description..."
            rows="3"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col items-center space-y-3">
          <label className="block text-lg font-medium text-gray-700">Upload Image</label>
          <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-200">
            <FaCloudUploadAlt className="text-4xl text-blue-500 mb-2" />
            <span className="text-gray-600">Click to upload</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          {preview && (
            <img src={preview} alt="Preview" className="w-64 h-40 object-cover border rounded-md mt-3" />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-md hover:opacity-90 transition">
          🚀 Create Package
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Package Added Successfully!</h2>
            <p className="text-gray-600 mt-2">Your package has been successfully created.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input Field Component
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-lg font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      placeholder={`Enter ${label.toLowerCase()}`}
      required
    />
  </div>
);

export default PackageAdd;
