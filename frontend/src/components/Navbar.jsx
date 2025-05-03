import React, { useState } from "react";
import logo from "../components/images/logo.png";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import profile_image from "../components/images/profile_image.png";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 p-2 bg-[#0a181f] z-50">
        {" "}
        {/* Reduced padding */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="SKW Photography" className="h-10" />{" "}
            {/* Reduced height of logo */}
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/Home"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              Home
            </Link>
            <a
              href="#about"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              About Us
            </a>
            <a
              href="#video"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              Video Gallery
            </a>
            <Link
              to="/packages"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              Packages
            </Link>
            <a
              href="#store"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              Store
            </a>
            <a
              href="/rental"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              Rental
            </a>
            <Link
              to="/feedbacks"
              className="text-[#8f8888] font-bold hover:text-[#747c7c]"
            >
              Feedback
            </Link>
          </div>
          <div className="flex space-x-4 mt-2">
            {" "}
            {/* Adjusted margin-top */}
            {isLoggedIn ? (
              <button
                onClick={toggleSidebar}
                className="text-white px-4 py-2 text-center"
              >
                <img className="w-10 h-10 rounded-full" src={profile_image} />{" "}
                {/* Adjusted profile image size */}
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-[#73747c] text-white px-4 py-2 rounded hover:bg-[#3c4c51] text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onLogout={onLogout}
      />
    </>
  );
};

export default Navbar;