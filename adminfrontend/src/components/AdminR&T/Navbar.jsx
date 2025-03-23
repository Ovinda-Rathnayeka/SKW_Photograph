import React from "react";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-md p-4">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
        Rental
      </h2>

      <div className="flex items-center space-x-6">
        <FaBell className="text-white text-xl cursor-pointer hover:text-yellow-300 transition duration-300" />
        <FaEnvelope className="text-white text-xl cursor-pointer hover:text-green-300 transition duration-300" />
        <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-red-300 transition duration-300" />
      </div>
    </div>
  );
}

export default Navbar;
