import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { logout } from "../Api/AuthAPI";
import Swal from "sweetalert2"; 

const Sidebar = ({ isOpen, onClose }) => {
 // const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#E66A4E',
        cancelButtonColor: '#d33',
      });

      if (result.isConfirmed) {
     
        const message = await logout();
        console.log(message); 
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("_id");
        Swal.fire(
          'Logged Out!',
          'You have successfully logged out.',
          'success'
        );
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire(
        'Error!',
        'Something went wrong during logout. Please try again.',
        'error'
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 ${isOpen ? "block" : "hidden"} z-20`}
      onClick={onClose}
    >
      <div
        className="bg-[#0a181f] w-64 h-full p-4 absolute right-0 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-gray-400"
          >
            <FaTimes />
          </button>
        </div>
        <div className="text-white mb-4">
          <h2 className="font-bold text-xl">User Profile</h2>
          <p className="text-sm text-gray-400">Welcome, User!</p>
        </div>
        <ul className="space-y-4">
          <li>
            <Link to="/profile" className="text-white">Profile</Link>
          </li>
          <li>
            <Link to="/history" className="text-white">Booking History</Link>
          </li>
          <li>
            <Link to="/bookings" className="text-white">Bookings</Link>
          </li>
          <li>
            <Link to="/feedback" className="text-white">Feedback</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-white">Log Out</button> 
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
