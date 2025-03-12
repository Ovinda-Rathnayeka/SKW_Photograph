import React from "react";
import logo from "../components/images/logo.png";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-[#0a181f]">
      <div className="flex items-center">
        <img src={logo} alt="SKW Photography" className="h-12" />
      </div>
      <div className="hidden md:flex space-x-8">
        <Link to="/Home" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Home</Link>
        <a href="#about" className="text-[#8f8888] font-bold hover:text-[#747c7c]">About Us</a>
        <a href="#video" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Video Gallery</a>
        <Link to="/packages" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Packages</Link>
        <a href="#store" className="text-[#8f8888] font-bold hover:text-[#747c7c]">Store</a>
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
