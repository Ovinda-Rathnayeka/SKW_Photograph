import React from "react";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
<<<<<<< HEAD
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md p-4">
      {/* Multi-Color Text for "Package & Booking Management" */}
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
        Feedback Management
=======
    <div className="flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b">
      <h2 className="text-2xl font-semibold text-gray-800">
        Package & Booking Management
>>>>>>> main
      </h2>

      <div className="flex items-center space-x-5">
        <FaBell className="text-gray-500 text-xl hover:text-blue-500 transition duration-200" />
        <FaEnvelope className="text-gray-500 text-xl hover:text-green-500 transition duration-200" />
        <FaUserCircle className="text-gray-600 text-2xl hover:text-purple-500 transition duration-200" />
      </div>
    </div>
  );
}

export default Navbar;
