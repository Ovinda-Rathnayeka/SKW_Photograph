import React, { useState, useEffect } from "react";
import { createPackage } from "../../API/PackageAPI.js";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import LoadingModal from "./LoadingModal.js";
import { useNavigate } from "react-router-dom";

function PackageAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
  const [touched, setTouched] = useState({});

  const validate = (fieldValues = packageData) => {
    const temp = { ...errors };

    if ("packageName" in fieldValues)
      temp.packageName = fieldValues.packageName
        ? fieldValues.packageName.length < 3
          ? "Package name must be at least 3 characters."
          : ""
        : "Package name is required.";

    if ("category" in fieldValues)
      temp.category = fieldValues.category ? "" : "Category is required.";

    if ("price" in fieldValues)
      temp.price = !fieldValues.price
        ? "Price is required."
        : parseFloat(fieldValues.price) <= 0
        ? "Price must be greater than 0."
        : "";

    if ("duration" in fieldValues)
      temp.duration = fieldValues.duration ? "" : "Duration is required.";

    if ("numberOfPhotos" in fieldValues)
      temp.numberOfPhotos = !fieldValues.numberOfPhotos
        ? "Number of photos is required."
        : parseInt(fieldValues.numberOfPhotos) <= 0
        ? "Number of photos must be greater than 0."
        : "";

    if ("deliveryTime" in fieldValues)
      temp.deliveryTime = fieldValues.deliveryTime
        ? ""
        : "Delivery time is required.";

    if ("description" in fieldValues)
      temp.description = !fieldValues.description
        ? "Description is required."
        : fieldValues.description.length < 10
        ? "Description must be at least 10 characters."
        : fieldValues.description.length > 500
        ? "Description must be less than 500 characters."
        : "";

    if ("image" in fieldValues) temp.image = image ? "" : "Image is required.";

    setErrors({ ...temp });

    return Object.values(temp).every((x) => x === "");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validate({ [name]: packageData[name] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...packageData, [name]: value };
    setPackageData(updated);

    if (touched[name]) {
      validate({ [name]: value });
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

      setImage(file);
      setPreview(URL.createObjectURL(file));
      setTouched({ ...touched, image: true });
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleServiceChange = (e) => {
    const servicesArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setPackageData({
      ...packageData,
      additionalServices: servicesArray,
    });
  };

  const validateAll = () => {
    const fieldsToValidate = {
      packageName: packageData.packageName,
      category: packageData.category,
      price: packageData.price,
      duration: packageData.duration,
      numberOfPhotos: packageData.numberOfPhotos,
      deliveryTime: packageData.deliveryTime,
      description: packageData.description,
      image: image,
    };

    // Mark all fields as touched
    const newTouched = {};
    Object.keys(fieldsToValidate).forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    return validate(fieldsToValidate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateAll()) {
      try {
        setIsSubmitting(true);

        // Create form data for image upload
        const formData = new FormData();
        formData.append("image", image);

        // Add all other package data to formData
        for (const key in packageData) {
          if (key !== "image" && key !== "additionalServices") {
            formData.append(key, packageData[key]);
          }
        }

        // Handle the array separately
        formData.append(
          "additionalServices",
          JSON.stringify(packageData.additionalServices)
        );

        await createPackage(packageData, image);
        setShowSuccessModal(true);

        // Reset form state
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
        setTouched({});
      } catch (error) {
        console.error("Error creating package:", error);
        setErrors((prev) => ({
          ...prev,
          form: "Failed to create package. Please try again.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const navigateToPackageDisplay = () => {
    setShowSuccessModal(false);
    navigate("/packagedisplay");
  };

  return (
    <>
      <LoadingModal show={loading} />

      {!loading && (
        <div className="bg-slate-50 min-h-screen py-8">
          {/* Admin Header */}
          <header className="bg-white shadow-md mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-800">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  Booking and Package Admin
                </span>
              </div>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white shadow-lg rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <span className="mr-2">📦</span> Create New Package
                </h2>
                <button
                  onClick={() => navigate("/packagedisplay")}
                  className="text-sm text-slate-600 hover:text-blue-600 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Back to Packages
                </button>
              </div>

              {errors.form && (
                <div className="m-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {errors.form}
                </div>
              )}

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Package Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="packageName"
                        value={packageData.packageName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          touched.packageName && errors.packageName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:ring-blue-500"
                        } rounded-md text-sm focus:outline-none focus:ring-2`}
                        placeholder="Enter package name"
                      />
                      {touched.packageName && errors.packageName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.packageName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={packageData.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          touched.category && errors.category
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:ring-blue-500"
                        } rounded-md text-sm focus:outline-none focus:ring-2`}
                      >
                        <option value="">Select Category</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Pre-Shoot">Pre-Shoot</option>
                        <option value="Pre-Shoot + Wedding">
                          Pre-Shoot + Wedding
                        </option>
                        <option value="Party">Party</option>
                        <option value="Normal">Normal</option>
                      </select>
                      {touched.category && errors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={packageData.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          touched.price && errors.price
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:ring-blue-500"
                        } rounded-md text-sm focus:outline-none focus:ring-2`}
                        placeholder="Enter price"
                      />
                      {touched.price && errors.price && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={packageData.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          touched.duration && errors.duration
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:ring-blue-500"
                        } rounded-md text-sm focus:outline-none focus:ring-2`}
                        placeholder="e.g. 2 hours"
                      />
                      {touched.duration && errors.duration && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.duration}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Number of Photos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="numberOfPhotos"
                        value={packageData.numberOfPhotos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          touched.numberOfPhotos && errors.numberOfPhotos
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:ring-blue-500"
                        } rounded-md text-sm focus:outline-none focus:ring-2`}
                        placeholder="Enter number of photos"
                      />
                      {touched.numberOfPhotos && errors.numberOfPhotos && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.numberOfPhotos}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Delivery Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="deliveryTime"
                        value={packageData.deliveryTime}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border ${
                          touched.deliveryTime && errors.deliveryTime
                            ? "border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:ring-blue-500"
                        } rounded-md text-sm focus:outline-none focus:ring-2`}
                        placeholder="e.g. 3-5 days"
                      />
                      {touched.deliveryTime && errors.deliveryTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.deliveryTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Photo Editing
                      </label>
                      <select
                        name="photoEditing"
                        value={packageData.photoEditing}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Additional Services
                      </label>
                      <input
                        type="text"
                        name="additionalServices"
                        value={packageData.additionalServices.join(", ")}
                        onChange={handleServiceChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Separate with commas"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Enter services separated by commas
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={packageData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows="4"
                      className={`w-full px-3 py-2 border ${
                        touched.description && errors.description
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 focus:ring-blue-500"
                      } rounded-md text-sm focus:outline-none focus:ring-2`}
                      placeholder="Enter a detailed description of the package"
                    ></textarea>
                    {touched.description && errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {packageData.description.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Image <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition ${
                        touched.image && errors.image
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <label
                        htmlFor="file-upload"
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FaCloudUploadAlt
                          className={`text-3xl mb-2 ${
                            touched.image && errors.image
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        />
                        <span className="text-sm text-slate-600">
                          Click to upload an image
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          PNG, JPG, GIF, WEBP up to 5MB
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                      />
                    </div>
                    {touched.image && errors.image && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.image}
                      </p>
                    )}

                    {preview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Image Preview
                        </p>
                        <div className="relative border border-slate-200 rounded-md overflow-hidden">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setPreview(null);
                            }}
                            className="absolute top-2 right-2 bg-white bg-opacity-70 p-1 rounded-full hover:bg-opacity-100"
                          >
                            <svg
                              className="w-5 h-5 text-slate-700"
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
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Creating Package...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            ></path>
                          </svg>
                          Create Package
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal with navigation */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full animate-fadeIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Success!
            </h2>
            <p className="text-slate-600 mb-6">
              Package has been created successfully.
            </p>
            <div className="space-y-3">
              <button
                onClick={navigateToPackageDisplay}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View All Packages
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                Create Another Package
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PackageAdd;
