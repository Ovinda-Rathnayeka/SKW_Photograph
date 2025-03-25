import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaBox,
  FaEye,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../images/logo.png";
function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={logo} // Replace with your logo URL
          alt="Logo"
          className="w-28 h-auto"
        />
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-3 flex-1">
        <SidebarItem icon={<FaTachometerAlt />} text="Dashboard" link="/" />
        <SidebarItem icon={<FaComments />} text="Feedbacks" link="/feedbacks" />
      </ul>

      {/* Logout Button */}
      <div className="mt-auto">
        <SidebarItem icon={<FaSignOutAlt />} text="Logout" link="/logout" isLogout />
      </div>
    </div>
  );
}

// Sidebar Item Component
const SidebarItem = ({ icon, text, link, isLogout }) => (
  <li className={`p-3 rounded-md flex items-center transition-all duration-200
    ${isLogout ? "hover:bg-red-600" : "hover:bg-gray-700"}
  `}>
    <span className="mr-3 text-lg">{icon}</span>
    <Link to={link} className="flex-1">{text}</Link>
  </li>
);

export default Sidebar;
