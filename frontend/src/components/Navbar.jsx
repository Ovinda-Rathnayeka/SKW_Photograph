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
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="SKW Photography" className="h-10" />
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/Home" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Home
            </Link>
            <a href="#video" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Video Gallery
            </a>
            <Link to="/packages" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Packages
            </Link>
            <Link to="/product" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Store
            </Link>
            <Link to="/rental" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Rental
            </Link>
            <Link to="/feedbacks" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Feedbacks
            </Link>
            <a href="#about" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              About Us
            </a>
            <a href="#contact" className="text-[#8f8888] font-bold hover:text-[#747c7c]">
              Contact Us
            </a>
          </div>
          <div className="flex space-x-4 mt-2">
            {isLoggedIn ? (
              <button
                onClick={toggleSidebar}
                className="text-white px-4 py-2 text-center"
              >
                <img className="w-10 h-10 rounded-full" src={profile_image} alt="Profile" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-[#73747c] text-white px-4 py-2 rounded hover:bg-[#3c4c51] text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#5b5c5e] text-white px-4 py-2 rounded hover:bg-[#30383d] text-center"
                >
                  Sign Up
                </Link>
              </>
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
=======
    <nav className="flex justify-between items-center p-4 bg-[#0a181f]">
      <div className="flex items-center">
        <img src={logo} alt="SKW Photography" className="h-12" />
      </div>
      <div className="hidden md:flex space-x-8">
        <Link to="/Home" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Home</Link>
        <a href="#video" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Video Gallery</a>
        <Link to="/packages" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Packages</Link>
        <Link to="/product" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Store</Link>
        <a href="/rental" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Rental</a>
        <Link to="/feedbacks" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Feedbacks</Link>
        <a href="#about" className="text-[#8f8888] font-bold hover:text-[#747c7c]">About Us</a>
        <a href="#contact" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Contact Us</a>
      </div>
      <div className="flex space-x-4 mt-4">
        {isLoggedIn ? (
          <button onClick={onLogout} className="bg-[#73747c] text-white px-4 py-2 rounded hover:bg-[#3c4c51] text-center">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="bg-[#73747c] text-white px-4 py-2 rounded hover:bg-[#3c4c51] text-center">Login</Link>
            <Link to="/signup" className="bg-[#5b5c5e] text-white px-4 py-2 rounded hover:bg-[#30383d] text-center">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
