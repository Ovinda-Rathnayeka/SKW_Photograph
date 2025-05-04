import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import dot from "../components/images/dot.jpg";
import { fetchUserDetails } from "../Api/AuthAPI.js";

const PRICES = {
  serviceType: {
    Photography: 1000,
    Videography: 1500,
    Both: 2300,
  },
  eventType: {
    Wedding: 500,
    Birthday: 300,
    "Corporate Event": 400,
    "Portrait Session": 250,
    "Product Shoot": 350,
    Other: 200,
  },
  packageType: {
    Basic: 0,
    Standard: 200,
    Premium: 500,
    Custom: 800,
  },
  transport: 10,
  durationBase: 30,
  durationExtra: 25,
  countRate: 2,
  countThreshold: 10,
};

const CreatePackage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceType: "",
    eventType: "",
    date: "",
    startTime: "",
    durationHours: "",
    location: "",
    address: "",
    packageType: "",
    count: "",
    transportRequired: "",
    additionalRequests: "",
    totalPrice: 0,
  });

  const [userId, setUserId] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Fetch user details on component mount
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails();
        if (!userDetails || !userDetails._id) {
          throw new Error("Could not retrieve user details");
        }
        setUserId(userDetails._id);
        console.log("Fetched User ID: ", userDetails._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Please login again to continue",
          confirmButtonText: "Go to Login",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
    };

    getUserDetails();
  }, [navigate]);

  // Calculate total price whenever related fields change
  useEffect(() => {
    const {
      serviceType,
      eventType,
      durationHours,
      packageType,
      count,
      transportRequired,
    } = formData;

    let price = 0;

    // Add base service price
    price += PRICES.serviceType[serviceType] || 0;

    // Add event type price
    price += PRICES.eventType[eventType] || 0;

    // Add package type price
    price += PRICES.packageType[packageType] || 0;

    // Calculate duration-based price
    const duration = Number(durationHours) || 0;
    if (duration > 0) {
      price += PRICES.durationBase;
      if (duration > 1) {
        price += (duration - 1) * PRICES.durationExtra;
      }
    }

    // Calculate price based on photo/video count
    const mediaCount = Number(count) || 0;
    if (mediaCount > PRICES.countThreshold) {
      price += (mediaCount - PRICES.countThreshold) * PRICES.countRate;
    }

    // Add transport fee if required
    if (transportRequired === "Yes") {
      price += PRICES.transport;
    }

    // Update the total price
    setFormData((prev) => ({
      ...prev,
      totalPrice: price,
    }));
  }, [
    formData.serviceType,
    formData.eventType,
    formData.durationHours,
    formData.packageType,
    formData.count,
    formData.transportRequired,
  ]);

  // Validate form fields and set errors
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      const {
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
      } = formData;

      // Service Type validation
      if (!serviceType) {
        newErrors.serviceType = "Service type is required";
      }

      // Event Type validation
      if (!eventType) {
        newErrors.eventType = "Event type is required";
      }

      // Date validation
      if (!date) {
        newErrors.date = "Date is required";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);

        if (selectedDate < today) {
          newErrors.date = "Date cannot be in the past";
        }
      }

      // Time validation
      if (!startTime) {
        newErrors.startTime = "Start time is required";
      } else if (date) {
        const now = new Date();
        const today = new Date().toISOString().split("T")[0];
        const selectedDateTime = new Date(`${date}T${startTime}`);

        if (date === today && selectedDateTime < now) {
          newErrors.startTime = "Start time cannot be in the past";
        }
      }

      // Duration validation
      const durationNum = Number(durationHours);
      if (!durationHours) {
        newErrors.durationHours = "Duration is required";
      } else if (isNaN(durationNum) || durationNum <= 0) {
        newErrors.durationHours = "Duration must be a positive number";
      } else if (durationNum > 12) {
        newErrors.durationHours = "Duration cannot exceed 12 hours";
      }

      // Location validation
      if (!location) {
        newErrors.location = "Location is required";
      }

      // Address validation
      if (!address) {
        newErrors.address = "Address is required";
      } else if (address.trim().length === 0) {
        newErrors.address = "Address cannot be empty";
      } else if (address.length > 100) {
        newErrors.address = "Address cannot exceed 100 characters";
      }

      // Package Type validation
      if (!packageType) {
        newErrors.packageType = "Package type is required";
      }

      // Count validation
      const countNum = Number(count);
      if (!count) {
        newErrors.count = "Count is required";
      } else if (isNaN(countNum) || countNum <= 0) {
        newErrors.count = "Count must be a positive number";
      } else if (countNum > 1000) {
        newErrors.count = "Count cannot exceed 1000";
      }

      // Transport Required validation
      if (!transportRequired) {
        newErrors.transportRequired = "Transport selection is required";
      }

      // Additional Requests validation
      if (additionalRequests.length > 100) {
        newErrors.additionalRequests =
          "Additional requests cannot exceed 100 characters";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Handle input blur (mark field as touched)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if form is valid
    if (!isFormValid) {
      // Mark all fields as touched to show all errors
      const allTouched = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      setIsSubmitting(false);
      return;
    }

    // Check if user is logged in
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "User ID is missing. Please log in again.",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare data for submission
    const dataToSubmit = {
      ...formData,
      customerId: userId,
      durationHours: Number(formData.durationHours),
      count: Number(formData.count),
      totalPrice: Number(formData.totalPrice),
      transportRequired: formData.transportRequired === "Yes",
    };

    try {
      // Make API request to create package
      const response = await axios.post(
        "http://localhost:5000/customization",
        dataToSubmit
      );

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Package created successfully!",
          text: "Your custom package has been created.",
          confirmButtonText: "View Bookings",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/packages");
          } else {
            navigate("/");
          }
        });
      }
    } catch (err) {
      console.error("Error creating package:", err);

      let errorMessage = "Failed to create package. Please try again.";

      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Package Creation Failed",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error message if field is touched and has error
  const showError = (field) => {
    return touched[field] && errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[#0D1317] text-white"
      style={{
        backgroundImage: `url(${dot})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center px-4 pt-20 pb-10">
        <div className="max-w-4xl w-full">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
              📦 Create a Custom Photography Package
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-[#1B242C] p-6 rounded-lg shadow-lg"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Type */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    📷 Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.serviceType && errors.serviceType
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    <option value="">Select Service Type</option>
                    <option>Photography</option>
                    <option>Videography</option>
                    <option>Both</option>
                  </select>
                  {showError("serviceType")}
                </div>

                {/* Event Type */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    🎉 Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.eventType && errors.eventType
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    <option value="">Select Event Type</option>
                    {Object.keys(PRICES.eventType).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  {showError("eventType")}
                </div>

                {/* Date */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    📅 Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.date && errors.date
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  {showError("date")}
                </div>

                {/* Start Time */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    ⏰ Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.startTime && errors.startTime
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  {showError("startTime")}
                </div>

                {/* Duration Hours */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    ⌛ Duration (hours) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min="1"
                    max="12"
                    step="0.5"
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.durationHours && errors.durationHours
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  {showError("durationHours")}
                </div>

                {/* Location */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    🏞️ Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.location && errors.location
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    <option value="">Select Location Type</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                  </select>
                  {showError("location")}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="text-yellow-400 flex items-center gap-1">
                    📍 Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    required
                    placeholder="Enter the exact address for the shoot"
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.address && errors.address
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  <div className="flex justify-between">
                    {showError("address")}
                    <p className="text-right text-xs text-gray-400">
                      {formData.address.length}/100
                    </p>
                  </div>
                </div>

                {/* Package Type */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    🎁 Package Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.packageType && errors.packageType
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    <option value="">Select Package Type</option>
                    {Object.keys(PRICES.packageType).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  {showError("packageType")}
                </div>

                {/* Count */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    🖼️ Count (Photos/Videos){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min="1"
                    max="1000"
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.count && errors.count
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  {showError("count")}
                </div>

                {/* Transport Required */}
                <div>
                  <label className="text-yellow-400 flex items-center gap-1">
                    🚚 Transport Required{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transportRequired"
                    value={formData.transportRequired}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.transportRequired && errors.transportRequired
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {showError("transportRequired")}
                </div>

                {/* Total Price */}
                <div>
                  <label className="text-yellow-400">💰 Total Price</label>
                  <input
                    type="text"
                    value={`Rs. ${formData.totalPrice}`}
                    disabled
                    className="w-full p-2 bg-gray-700 text-green-400 font-semibold rounded-md mt-1"
                  />
                </div>

                {/* Additional Requests */}
                <div className="md:col-span-2">
                  <label className="text-yellow-400">
                    📝 Additional Requests (Optional)
                  </label>
                  <textarea
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    rows={3}
                    placeholder="Any special requests or requirements?"
                    className={`w-full p-2 bg-gray-800 text-white rounded-md mt-1 border ${
                      touched.additionalRequests && errors.additionalRequests
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  />
                  <div className="flex justify-between">
                    {showError("additionalRequests")}
                    <p className="text-right text-xs text-gray-400">
                      {formData.additionalRequests.length}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-800 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                  Price Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {formData.serviceType && (
                    <>
                      <div>Service ({formData.serviceType}):</div>
                      <div className="text-right">
                        Rs. {PRICES.serviceType[formData.serviceType] || 0}
                      </div>
                    </>
                  )}
                  {formData.eventType && (
                    <>
                      <div>Event ({formData.eventType}):</div>
                      <div className="text-right">
                        Rs. {PRICES.eventType[formData.eventType] || 0}
                      </div>
                    </>
                  )}
                  {formData.packageType && (
                    <>
                      <div>Package ({formData.packageType}):</div>
                      <div className="text-right">
                        Rs. {PRICES.packageType[formData.packageType] || 0}
                      </div>
                    </>
                  )}
                  {formData.durationHours && (
                    <>
                      <div>Duration ({formData.durationHours} hrs):</div>
                      <div className="text-right">
                        Rs.{" "}
                        {Number(formData.durationHours) > 0
                          ? PRICES.durationBase +
                            Math.max(0, Number(formData.durationHours) - 1) *
                              PRICES.durationExtra
                          : 0}
                      </div>
                    </>
                  )}
                  {formData.count &&
                    Number(formData.count) > PRICES.countThreshold && (
                      <>
                        <div>Extra photos/videos:</div>
                        <div className="text-right">
                          Rs.{" "}
                          {(Number(formData.count) - PRICES.countThreshold) *
                            PRICES.countRate}
                        </div>
                      </>
                    )}
                  {formData.transportRequired === "Yes" && (
                    <>
                      <div>Transport:</div>
                      <div className="text-right">Rs. {PRICES.transport}</div>
                    </>
                  )}
                  <div className="font-bold text-green-400 pt-2 border-t border-gray-600">
                    Total:
                  </div>
                  <div className="font-bold text-green-400 text-right pt-2 border-t border-gray-600">
                    Rs. {formData.totalPrice}
                  </div>
                </div>
              </div>

              {/* Form Notes */}
              <div className="text-xs text-gray-400 space-y-1 mt-4">
                <p>* Required fields</p>
                <p>
                  - Photography: Rs. 1000 | Videography: Rs. 1500 | Both: Rs.
                  2300
                </p>
                <p>- Base duration fee: Rs. 30 + Rs. 25 per additional hour</p>
                <p>- Extra photos/videos: Rs. 2 each (after first 10)</p>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`${
                    isFormValid && !isSubmitting
                      ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                      : "bg-gray-600 cursor-not-allowed"
                  } text-white px-6 py-2 rounded-lg font-semibold shadow-md flex items-center justify-center mx-auto`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "📤 Submit Package"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
