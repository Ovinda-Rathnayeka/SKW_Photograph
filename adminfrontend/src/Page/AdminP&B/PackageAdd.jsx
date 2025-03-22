import React, { useState } from "react";
import { createPackage } from "../../API/PackageAPI.js";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

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
  const [errors, setErrors] = useState({});

  const validate = (fieldValues = packageData) => {
    const temp = { ...errors };

    if ("packageName" in fieldValues)
      temp.packageName = fieldValues.packageName ? "" : "Package name is required.";

    if ("category" in fieldValues)
      temp.category = fieldValues.category ? "" : "Category is required.";

    if ("price" in fieldValues)
      temp.price =
        fieldValues.price && parseFloat(fieldValues.price) > 0
          ? ""
          : "Enter a valid price.";

    if ("duration" in fieldValues)
      temp.duration = fieldValues.duration ? "" : "Duration is required.";

    if ("numberOfPhotos" in fieldValues)
      temp.numberOfPhotos =
        fieldValues.numberOfPhotos && parseInt(fieldValues.numberOfPhotos) > 0
          ? ""
          : "Enter number of photos.";

    if ("deliveryTime" in fieldValues)
      temp.deliveryTime = fieldValues.deliveryTime ? "" : "Delivery time is required.";

    if ("description" in fieldValues)
      temp.description =
        fieldValues.description.length >= 10
          ? ""
          : "Description must be at least 10 characters.";

    if ("image" in fieldValues)
      temp.image = image ? "" : "Image is required.";

    setErrors({ ...temp });

    return Object.values(temp).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...packageData, [name]: value };
    setPackageData(updated);
    validate({ [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      validate({ image: file });
    }
  };

  const handleServiceChange = (e) => {
    setPackageData({
      ...packageData,
      additionalServices: e.target.value.split(",").map((s) => s.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
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
        setErrors({});
      } catch (error) {
        console.error("Error creating package:", error);
        alert("Error creating package.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-slate-200">
      <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
        📦 Create New Package
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Package Name" name="packageName" value={packageData.packageName} onChange={handleChange} error={errors.packageName} />
          <InputField label="Category" name="category" value={packageData.category} onChange={handleChange} error={errors.category} />
          <InputField label="Price ($)" name="price" type="number" value={packageData.price} onChange={handleChange} error={errors.price} />
          <InputField label="Duration" name="duration" value={packageData.duration} onChange={handleChange} error={errors.duration} />
          <InputField label="Number of Photos" name="numberOfPhotos" type="number" value={packageData.numberOfPhotos} onChange={handleChange} error={errors.numberOfPhotos} />
          <InputField label="Delivery Time" name="deliveryTime" value={packageData.deliveryTime} onChange={handleChange} error={errors.deliveryTime} />
        </div>

        {/* Photo Editing */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Photo Editing</label>
          <select
            name="photoEditing"
            value={packageData.photoEditing}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="Basic">Basic</option>
            <option value="Advanced">Advanced</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Additional Services */}
        <InputField
          label="Additional Services (comma-separated)"
          name="additionalServices"
          value={packageData.additionalServices.join(", ")}
          onChange={handleServiceChange}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={packageData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Short description of the package"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image</label>
          <label className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <FaCloudUploadAlt className="text-3xl text-blue-500 mb-2" />
            <span className="text-sm text-gray-600">Click to upload</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-full h-52 object-cover rounded-md border border-gray-300"
            />
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium text-sm"
          >
            🚀 Create Package
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800">Success!</h2>
            <p className="text-gray-600 mt-1">Package has been created successfully.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🧩 Input Field with error
const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default PackageAdd;
