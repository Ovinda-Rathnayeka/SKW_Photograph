import React, { useState, useEffect } from "react";
import {
  getAllPackages,
  deletePackageById,
  updatePackageById,
} from "../../API/PackageAPI.js";

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
    photoEditing: "Basic",
    deliveryTime: "",
    additionalServices: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

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

  const handleDelete = async (id) => {
    try {
      await deletePackageById(id);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

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
      image: pkg.image,
    });
    setErrors({});
    setIsPopupOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPackageData({ ...updatedPackageData, [name]: value });
    validate({ [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedPackageData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const validate = (fields = updatedPackageData) => {
    const temp = { ...errors };

    if ("packageName" in fields)
      temp.packageName = fields.packageName ? "" : "Package name is required.";

    if ("category" in fields)
      temp.category = fields.category ? "" : "Category is required.";

    if ("price" in fields)
      temp.price =
        fields.price && parseFloat(fields.price) > 0
          ? ""
          : "Enter a valid price.";

    if ("duration" in fields)
      temp.duration = fields.duration ? "" : "Duration is required.";

    if ("numberOfPhotos" in fields)
      temp.numberOfPhotos =
        fields.numberOfPhotos && parseInt(fields.numberOfPhotos) > 0
          ? ""
          : "Number of photos must be greater than 0.";

    if ("deliveryTime" in fields)
      temp.deliveryTime = fields.deliveryTime ? "" : "Delivery time is required.";

    if ("description" in fields)
      temp.description =
        fields.description.length >= 10
          ? ""
          : "Description must be at least 10 characters.";

    setErrors({ ...temp });

    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const updatedPackage = await updatePackageById(
          selectedPackage._id,
          updatedPackageData
        );
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg._id === selectedPackage._id ? updatedPackage : pkg
          )
        );
        setIsPopupOpen(false);
      } catch (error) {
        console.error("Error updating package:", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">
        📦 All Packages
      </h1>

      <div className="overflow-x-auto shadow-md border border-slate-200 rounded-lg">
        <table className="min-w-full bg-white text-sm text-left">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-6 py-3 border-b">Package Name</th>
              <th className="px-6 py-3 border-b">Category</th>
              <th className="px-6 py-3 border-b">Price ($)</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr
                key={pkg._id}
                className="hover:bg-slate-50 transition border-b"
              >
                <td className="px-6 py-3">{pkg.packageName}</td>
                <td className="px-6 py-3">{pkg.category}</td>
                <td className="px-6 py-3">{pkg.price}</td>
                <td className="px-6 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleUpdate(pkg)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="px-3 py-1 text-xs bg-rose-100 text-rose-700 rounded hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              ✏️ Update Package
            </h2>
            <form onSubmit={handleSubmitUpdate} className="space-y-4">
              <FormField
                label="Package Name"
                name="packageName"
                value={updatedPackageData.packageName}
                onChange={handleChange}
                error={errors.packageName}
              />
              <FormField
                label="Category"
                name="category"
                value={updatedPackageData.category}
                onChange={handleChange}
                error={errors.category}
              />
              <FormField
                label="Price"
                name="price"
                type="number"
                value={updatedPackageData.price}
                onChange={handleChange}
                error={errors.price}
              />
              <FormField
                label="Duration"
                name="duration"
                value={updatedPackageData.duration}
                onChange={handleChange}
                error={errors.duration}
              />
              <FormField
                label="Number of Photos"
                name="numberOfPhotos"
                type="number"
                value={updatedPackageData.numberOfPhotos}
                onChange={handleChange}
                error={errors.numberOfPhotos}
              />
              <FormField
                label="Delivery Time"
                name="deliveryTime"
                value={updatedPackageData.deliveryTime}
                onChange={handleChange}
                error={errors.deliveryTime}
              />
              <FormField
                label="Additional Services"
                name="additionalServices"
                value={updatedPackageData.additionalServices}
                onChange={handleChange}
              />
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={updatedPackageData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Image Preview */}
              {updatedPackageData.image && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Preview Image
                  </label>
                  <img
                    src={updatedPackageData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded border border-gray-300"
                  />
                </div>
              )}

              {/* Upload New Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload New Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Reusable Input Field with Error Support
const FormField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default PackageDisplay;
