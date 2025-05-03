import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaUserAlt,
  FaHistory,
  FaCalendarAlt,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout, fetchUserDetails } from "../Api/AuthAPI";
import Swal from "sweetalert2";

const Sidebar = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUserDetails();
        setUserName(user.name); // Assumes user object has a "name" property
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, log me out!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#E66A4E",
        cancelButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        const message = await logout();
        console.log(message);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("_id");
        Swal.fire(
          "Logged Out!",
          "You have successfully logged out.",
          "success"
        );
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire(
        "Error!",
        "Something went wrong during logout. Please try again.",
        "error"
      );
    }
  };

  const handleLinkClick = () => {
    onClose(); // Close the sidebar when a link is clicked
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 ${
        isOpen ? "block" : "hidden"
      } z-20`}
      onClick={onClose}
    >
      <div
        className="bg-[#0a181f] w-64 h-full p-6 absolute right-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-gray-400"
          >
            <FaTimes />
          </button>
        </div>
        <div className="text-white mb-8">
          <h2 className="font-bold text-2xl">Hi {userName || "User"}!</h2>
          <p className="text-sm text-gray-400">Welcome</p>
        </div>
        <ul className="space-y-6">
          <li>
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="text-white flex items-center gap-3"
            >
              <FaUserAlt className="text-lg" /> Profile
            </Link>
          </li>
          <li>
            <Link
              to="/booking-history"
              onClick={handleLinkClick}
              className="text-white flex items-center gap-3"
            >
              <FaHistory className="text-lg" /> Booking History
            </Link>
          </li>
          <li>
            <Link
              to="/bookings"
              onClick={handleLinkClick}
              className="text-white flex items-center gap-3"
            >
              <FaCalendarAlt className="text-lg" /> Payment
            </Link>
          </li>
          <li>
            <Link
              to="/feedback"
              onClick={handleLinkClick}
              className="text-white flex items-center gap-3"
            >
              <FaComments className="text-lg" /> Feedback
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-white flex items-center gap-3"
            >
              <FaSignOutAlt className="text-lg" /> Log Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
