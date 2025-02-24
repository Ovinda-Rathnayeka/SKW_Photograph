import React from "react";
import logo from "./images/logo.png";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-[#0a181f]">
      <div className="flex items-center">
        <img src={logo} alt="SKW Photography" className="h-12" />
      </div>
      <div className="hidden md:flex space-x-8">
        <a
          href="#home"
          className="text-[#8f8888] font-bold hover:text-[#747c7c]"
        >
          Home
        </a>
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
        <a
          href="#packages"
          className="text-[#8f8888] font-bold hover:text-[#747c7c]"
        >
          Packages
        </a>
        <a
          href="#store"
          className="text-[#8f8888] font-bold hover:text-[#747c7c]"
        >
          Store
        </a>
        <a
          href="#contact"
          className="text-[#8f8888] font-bold hover:text-[#747c7c]"
        >
          Contact Us
        </a>
      </div>
      <div className="flex space-x-4">
        <button className="bg-[#73747c] text-white px-4 py-2 rounded hover:bg-[#3c4c51]">
          Login
        </button>
        <button className="bg-[#5b5c5e] text-white px-4 py-2 rounded hover:bg-[#30383d]">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
