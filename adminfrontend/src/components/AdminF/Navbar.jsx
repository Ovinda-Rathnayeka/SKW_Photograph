import React from "react";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b">
      <h2 className="text-2xl font-semibold text-gray-800">
        Feedback & Review Management
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
