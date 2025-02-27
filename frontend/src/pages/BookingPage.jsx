import React, { useEffect, useState } from "react";
import { fetchUserDetails } from "../Api/AuthAPI.js";
import { createBooking } from "../Api/BookingAPI.js";

const BookingPage = ({ selectedPackage, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(selectedPackage?.price || 0);
  const [selectedAdditions, setSelectedAdditions] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Add-on options
  const additions = [
    { id: 1, name: "Professional Makeup", price: 50 },
    { id: 2, name: "Luxury Dress Rental", price: 80 },
    { id: 3, name: "Extra Photo Edits", price: 30 },
    { id: 4, name: "Express Delivery", price: 20 },
  ];

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserDetails();
        setUser(userData);
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  if (!selectedPackage) return null;

  const handleToggleAddition = (addition) => {
    const isSelected = selectedAdditions.some((item) => item.id === addition.id);
    if (isSelected) {
      setSelectedAdditions(selectedAdditions.filter((item) => item.id !== addition.id));
      setTotalPrice(totalPrice - addition.price);
    } else {
      setSelectedAdditions([...selectedAdditions, addition]);
      setTotalPrice(totalPrice + addition.price);
    }
  };

  const handleConfirmBooking = async () => {
    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    setIsSubmitting(true);
    const bookingData = {
      customerId: user?._id,
      packageId: selectedPackage._id,
      bookingDate: date,
      bookingTime: time,
      totalPrice,
      additionalNotes: selectedAdditions.map(addition => addition.name).join(", "),
    };

    try {
      const result = await createBooking(bookingData);
      alert("Booking Confirmed! ID: " + result._id);
      onClose(); // Close the booking modal
    } catch (error) {
      alert("Failed to create booking: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-[#1B242C] p-6 rounded-lg shadow-lg w-[95%] max-w-[900px] text-white flex flex-col">
        
        <h2 className="text-xl font-bold text-red-500 mb-4 text-center flex items-center justify-center">
          📸 Confirm Your Booking
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-yellow-400">📅 Date:</label>
            <input 
              type="date" 
              className="w-full p-2 bg-gray-800 text-white rounded-md mt-1" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="text-yellow-400">⏰ Time:</label>
            <input 
              type="time" 
              className="w-full p-2 bg-gray-800 text-white rounded-md mt-1" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required
            />
          </div>
        </div>

        {/* Customer & Package Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Customer Details */}
          <div className="bg-[#2A3A45] p-4 rounded-lg">
            <h3 className="text-md font-semibold text-gray-300">🧑‍💼 Customer Info</h3>
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : (
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>
            )}
          </div>

          <div className="bg-[#2A3A45] p-4 rounded-lg">
            <h3 className="text-md font-semibold text-yellow-400">{selectedPackage.packageName}</h3>
            <p className="text-xs text-gray-300">{selectedPackage.description}</p>
            <div className="space-y-1 mt-2 text-sm">
              <p><strong>📂 Category:</strong> {selectedPackage.category}</p>
              <p><strong>⌛ Duration:</strong> {selectedPackage.duration}</p>
              <p><strong>📸 Photos:</strong> {selectedPackage.numberOfPhotos}</p>
              <p><strong>🎨 Editing:</strong> {selectedPackage.photoEditing}</p>
              <p><strong>🚚 Delivery:</strong> {selectedPackage.deliveryTime}</p>
              <p className="text-red-400 font-bold">Base Price: ${selectedPackage.price}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2A3A45] p-4 rounded-lg mt-4">
          <h3 className="text-md font-semibold text-yellow-400">✨ Add-ons</h3>
          <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
            {additions.map((addition) => (
              <label key={addition.id} className="flex items-center justify-between bg-[#1F2937] p-2 rounded-md cursor-pointer hover:bg-[#374151]">
                <input 
                  type="checkbox" 
                  checked={selectedAdditions.some((item) => item.id === addition.id)} 
                  onChange={() => handleToggleAddition(addition)} 
                />
                <span className="text-gray-300">{addition.name}</span>
                <span className="text-yellow-400">${addition.price}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 text-lg font-bold text-gray-300 text-center">
            💰 Total Price: <span className="text-green-400">${totalPrice}</span>
          </div>

          <div className="flex justify-between mt-4">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" 
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
