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

  
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUserId(userDetails._id); 
        console.log("Fetched User ID: ", userDetails._id); 
      } catch (error) {
        console.error("Error fetching user details:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch user details",
          text: error.message,
        });
      }
    };

    getUserDetails();
  }, []);

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

    price += PRICES.serviceType[serviceType] || 0;
    price += PRICES.eventType[eventType] || 0;
    price += PRICES.packageType[packageType] || 0;

    const duration = Number(durationHours);
    if (duration > 0) {
      price += PRICES.durationBase;
      if (duration > 1) {
        price += (duration - 1) * PRICES.durationExtra;
      }
    }

    const mediaCount = Number(count);
    if (mediaCount > PRICES.countThreshold) {
      price += (mediaCount - PRICES.countThreshold) * PRICES.countRate;
    }

    if (transportRequired === "Yes") {
      price += PRICES.transport;
    }

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

  useEffect(() => {
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

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const selectedDate = new Date(date);
    const selectedTime = new Date(`${date}T${startTime}`);

    const isPastDate = date && selectedDate < new Date(today);
    const isPastTime = date === today && startTime && selectedTime < now;

    const isValid =
      serviceType &&
      eventType &&
      location &&
      packageType &&
      transportRequired &&
      address.trim().length > 0 &&
      address.length <= 100 &&
      !isPastDate &&
      !isPastTime &&
      Number(durationHours) > 0 &&
      Number(count) > 0 &&
      additionalRequests.length <= 100;

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User ID is missing, please log in again.",
      });
      return;
    }

    const dataToSubmit = {
      ...formData,
      customerId: userId, 
      durationHours: Number(formData.durationHours),
      count: Number(formData.count),
      totalPrice: Number(formData.totalPrice),
      transportRequired: formData.transportRequired === "Yes",
    };

    try {
      await axios.post("http://localhost:5000/customization", dataToSubmit);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Package created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (err) {
      console.error("Error creating package:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create package. Please check console and form data.",
      });
    }
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
      <div className="min-h-screen bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
              📦 Create a Custom Package
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-[#1B242C] p-6 rounded-lg shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               
                <div>
                  <label className="text-yellow-400">📷 Service Type</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  >
                    <option value="">Select</option>
                    <option>Photography</option>
                    <option>Videography</option>
                    <option>Both</option>
                  </select>
                </div>

               
                <div>
                  <label className="text-yellow-400">🎉 Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  >
                    <option value="">Select</option>
                    {Object.keys(PRICES.eventType).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                
                <div>
                  <label className="text-yellow-400">📅 Date</label>
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  />
                </div>

                
                <div>
                  <label className="text-yellow-400">⏰ Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  />
                </div>

                
                <div>
                  <label className="text-yellow-400">⌛ Duration (hours)</label>
                  <input
                    type="number"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  />
                </div>

               
                <div>
                  <label className="text-yellow-400">🏞️ Location</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  >
                    <option value="">Select</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                  </select>
                </div>

                
                <div className="md:col-span-2">
                  <label className="text-yellow-400">📍 Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  />
                </div>

                
                <div>
                  <label className="text-yellow-400">🎁 Package Type</label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  >
                    <option value="">Select</option>
                    {Object.keys(PRICES.packageType).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                
                <div>
                  <label className="text-yellow-400">
                    🖼️ Count (Photos/Videos)
                  </label>
                  <input
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  />
                </div>

                
                <div>
                  <label className="text-yellow-400">
                    🚚 Transport Required
                  </label>
                  <select
                    name="transportRequired"
                    value={formData.transportRequired}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

               
                <div>
                  <label className="text-yellow-400">💰 Total Price</label>
                  <input
                    type="text"
                    value={`Rs. ${formData.totalPrice}`}
                    disabled
                    className="w-full p-2 bg-gray-700 text-green-400 font-semibold rounded-md mt-1"
                  />
                </div>

                
                <div className="md:col-span-2">
                  <label className="text-yellow-400">
                    📝 Additional Requests
                  </label>
                  <textarea
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleChange}
                    maxLength={100}
                    rows={3}
                    className="w-full p-2 bg-gray-800 text-white rounded-md mt-1"
                  />
                  <p className="text-right text-sm text-gray-400">
                    {formData.additionalRequests.length}/100
                  </p>
                </div>
              </div>

              
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`${
                    isFormValid
                      ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                      : "bg-gray-600 cursor-not-allowed"
                  } text-white px-6 py-2 rounded-lg font-semibold shadow-md`}
                >
                  📤 Submit Package
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
