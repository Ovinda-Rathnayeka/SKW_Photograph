import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaBox,
  FaEye,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import logo from "../images/logo.png";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex flex-col min-h-screen bg-black text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${
            isOpen ? "w-24" : "w-10"
          } mx-auto`}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-3 flex-1">
        <SidebarItem icon={<FaTachometerAlt />} text="Dashboard" link="/" />
        <SidebarItem icon={<FaUser />} text="Bookings" link="/displaybooking" />
        <SidebarItem icon={<FaCog />} text="Payment" link="/payment" />
        <SidebarItem icon={<FaBox />} text="Add Package" link="/add-package" />
        <SidebarItem icon={<FaEye />} text="View Packages" link="/packagedisplay" />
      </ul>

      {/* Logout */}
      <div className="px-2 mt-auto pb-6">
        <SidebarItem
          icon={<FaSignOutAlt />}
          text="Logout"
          link="/logout"
          isLogout
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, text, link, isLogout, isOpen }) => (
  <li>
    <Link
      to={link}
      className={`flex items-center gap-4 px-3 py-3 rounded-md transition-all duration-200
        ${
          isLogout
            ? "hover:bg-red-600 text-red-400"
            : "hover:bg-gray-800 text-white"
        }
      `}
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="text-sm font-medium">{text}</span>}
    </Link>
  </li>
);

export default Sidebar;
