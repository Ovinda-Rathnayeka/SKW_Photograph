import React, { useState, useEffect } from "react";
import {
  getAllPackages,
  deletePackageById,
  updatePackageById,
} from "../../API/PackageAPI.js";

function PackageDisplay() {
  const [packages, setPackages] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPackages();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePackageById(id);
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleUpdate = (pkg) => {
    setSelectedPackage(pkg);
    setUpdatedPackageData({
      packageName: pkg.packageName || "",
      category: pkg.category || "",
      price: pkg.price || "",
      duration: pkg.duration || "",
      numberOfPhotos: pkg.numberOfPhotos || "",
      photoEditing: pkg.photoEditing || "Basic",
      deliveryTime: pkg.deliveryTime || "",
      additionalServices: pkg.additionalServices?.join(", ") || "",
      description: pkg.description || "",
      image: pkg.image || null,
    });
    setErrors({});
    setTouched({});
    setIsPopupOpen(true);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, updatedPackageData[name]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPackageData({ ...updatedPackageData, [name]: value });
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size and type
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validImageTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload a valid image (JPEG, PNG, GIF, WEBP)",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setUpdatedPackageData((prev) => ({
        ...prev,
        image: file,
      }));
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "packageName":
        errorMessage = !value.trim()
          ? "Package name is required"
          : value.length < 3
          ? "Package name must be at least 3 characters"
          : "";
        break;

      case "category":
        errorMessage = !value.trim() ? "Category is required" : "";
        break;

      case "price":
        errorMessage = !value
          ? "Price is required"
          : isNaN(parseFloat(value)) || parseFloat(value) <= 0
          ? "Price must be a positive number"
          : "";
        break;

      case "duration":
        errorMessage = !value.trim() ? "Duration is required" : "";
        break;

      case "numberOfPhotos":
        errorMessage = !value
          ? "Number of photos is required"
          : isNaN(parseInt(value)) || parseInt(value) <= 0
          ? "Number of photos must be a positive integer"
          : "";
        break;

      case "deliveryTime":
        errorMessage = !value.trim() ? "Delivery time is required" : "";
        break;

      case "description":
        errorMessage = !value.trim()
          ? "Description is required"
          : value.length < 10
          ? "Description must be at least 10 characters"
          : value.length > 500
          ? "Description must be less than 500 characters"
          : "";
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    return !errorMessage;
  };

  const validateAll = () => {
    const fields = [
      "packageName",
      "category",
      "price",
      "duration",
      "numberOfPhotos",
      "deliveryTime",
      "description",
    ];

    // Mark all fields as touched
    const newTouched = {};
    fields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
      if (!validateField(field, updatedPackageData[field])) {
        isValid = false;
        newErrors[field] = errors[field] || `${field} is invalid`;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (validateAll()) {
      try {
        setIsLoading(true);
        const formData = new FormData();

        if (
          updatedPackageData.image &&
          updatedPackageData.image instanceof File
        ) {
          formData.append("image", updatedPackageData.image);
        }

        for (const key in updatedPackageData) {
          if (updatedPackageData.hasOwnProperty(key) && key !== "image") {
            formData.append(key, updatedPackageData[key]);
          }
        }

        const updatedPackage = await updatePackageById(
          selectedPackage._id,
          updatedPackageData,
          formData
        );

        setPackages((prev) =>
          prev.map((pkg) =>
            pkg._id === selectedPackage._id ? updatedPackage : pkg
          )
        );

        setUpdateSuccess(true);
        setTimeout(() => {
          setUpdateSuccess(false);
          setIsPopupOpen(false);
        }, 1500);
      } catch (error) {
        console.error("Error updating package:", error);
        setErrors((prev) => ({
          ...prev,
          form: "Failed to update package. Please try again.",
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Admin Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              Welcome,Package And Booking Manager
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <span className="mr-2">📦</span> Package Management
            </h2>
          </div>

          {isLoading && !isPopupOpen ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                ></path>
              </svg>
              <p className="mt-2">No packages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm text-left">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-3 border-b">Package Name</th>
                    <th className="px-6 py-3 border-b">Category</th>
                    <th className="px-6 py-3 border-b">Price ($)</th>
                    <th className="px-6 py-3 border-b">Duration</th>
                    <th className="px-6 py-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr
                      key={pkg._id}
                      className="hover:bg-slate-50 transition border-b"
                    >
                      <td className="px-6 py-3 font-medium">
                        {pkg.packageName}
                      </td>
                      <td className="px-6 py-3">{pkg.category}</td>
                      <td className="px-6 py-3">${pkg.price}</td>
                      <td className="px-6 py-3">{pkg.duration}</td>
                      <td className="px-6 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleUpdate(pkg)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setConfirmDelete(pkg._id)}
                          className="px-3 py-1 text-xs bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to delete this package? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Package Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            {updateSuccess ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-800 mb-1">
                  Package Updated!
                </h3>
                <p className="text-slate-600">
                  Your package has been updated successfully.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <span className="mr-2">✏️</span> Update Package
                  </h2>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>

                {errors.form && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {errors.form}
                  </div>
                )}

                <form onSubmit={handleSubmitUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Package Name"
                      name="packageName"
                      value={updatedPackageData.packageName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.packageName ? errors.packageName : ""}
                      required
                    />
                    <FormField
                      label="Category"
                      name="category"
                      value={updatedPackageData.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.category ? errors.category : ""}
                      required
                    />
                    <FormField
                      label="Price ($)"
                      name="price"
                      type="number"
                      value={updatedPackageData.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.price ? errors.price : ""}
                      required
                    />
                    <FormField
                      label="Duration"
                      name="duration"
                      value={updatedPackageData.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.duration ? errors.duration : ""}
                      required
                    />
                    <FormField
                      label="Number of Photos"
                      name="numberOfPhotos"
                      type="number"
                      value={updatedPackageData.numberOfPhotos}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.numberOfPhotos ? errors.numberOfPhotos : ""
                      }
                      required
                    />
                    <FormField
                      label="Delivery Time"
                      name="deliveryTime"
                      value={updatedPackageData.deliveryTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.deliveryTime ? errors.deliveryTime : ""}
                      required
                    />
                    <FormField
                      label="Photo Editing"
                      name="photoEditing"
                      type="select"
                      value={updatedPackageData.photoEditing}
                      onChange={handleChange}
                      options={[
                        { value: "Basic", label: "Basic" },
                        { value: "Standard", label: "Standard" },
                        { value: "Advanced", label: "Advanced" },
                        { value: "Premium", label: "Premium" },
                      ]}
                    />
                    <FormField
                      label="Additional Services"
                      name="additionalServices"
                      value={updatedPackageData.additionalServices}
                      onChange={handleChange}
                      placeholder="Separate with commas"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={updatedPackageData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows="3"
                      className={`w-full px-3 py-2 border ${
                        touched.description && errors.description
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 focus:ring-blue-500"
                      } rounded-md text-sm focus:outline-none focus:ring-2`}
                      placeholder="Describe the package in detail..."
                    ></textarea>
                    {touched.description && errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {updatedPackageData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Package Image
                    </label>

                    <div className="flex items-start space-x-4">
                      {/* Current Image Preview */}
                      {selectedPackage?.image &&
                        typeof selectedPackage.image === "string" && (
                          <div className="w-28 h-28 relative">
                            <img
                              src={selectedPackage.image}
                              alt="Current package"
                              className="w-full h-full object-cover rounded-md border border-slate-200"
                            />
                            <span className="absolute bottom-0 left-0 right-0 bg-slate-800 bg-opacity-70 text-white text-xs py-1 text-center">
                              Current
                            </span>
                          </div>
                        )}

                      {/* New Image Preview */}
                      {updatedPackageData.image &&
                        updatedPackageData.image instanceof File && (
                          <div className="w-28 h-28 relative">
                            <img
                              src={URL.createObjectURL(
                                updatedPackageData.image
                              )}
                              alt="New package"
                              className="w-full h-full object-cover rounded-md border border-slate-200"
                            />
                            <span className="absolute bottom-0 left-0 right-0 bg-blue-600 bg-opacity-70 text-white text-xs py-1 text-center">
                              New
                            </span>
                          </div>
                        )}

                      {/* Upload button */}
                      <div className="flex-1">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-md hover:border-blue-400 transition-colors"
                        >
                          <div className="text-center py-2">
                            <svg
                              className="mx-auto h-8 w-8 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <p className="mt-1 text-sm text-slate-600">
                              {updatedPackageData.image instanceof File
                                ? updatedPackageData.image.name
                                : "Click to upload a new image"}
                            </p>
                            <p className="text-xs text-slate-500">
                              PNG, JPG, GIF, WEBP up to 5MB
                            </p>
                          </div>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          name="image"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {errors.image && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.image}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end pt-4 space-x-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsPopupOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors flex items-center ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = "",
  options = [],
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-3 py-2 border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-300 focus:ring-blue-500"
        } rounded-md text-sm focus:outline-none focus:ring-2`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-300 focus:ring-blue-500"
        } rounded-md text-sm focus:outline-none focus:ring-2`}
      />
    )}

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default PackageDisplay;
