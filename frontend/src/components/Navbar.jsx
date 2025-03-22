import React, { useState } from "react";
import logo from "../components/images/logo.png";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 p-4 bg-[#0a181f] z-50">
        <div className="flex justify-between items-center">
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
               <button
               onClick={toggleSidebar}
               className="text-white px-4 py-2 text-center">
               Profile
             </button>
            ) : (
              <>
                <Link to="/login" className="bg-[#73747c] text-white px-4 py-2 rounded hover:bg-[#3c4c51] text-center">Login</Link>
               
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-20"> 
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>
    </>
  );
};

export default Navbar;
