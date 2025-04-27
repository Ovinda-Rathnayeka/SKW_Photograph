import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginEmployee } from "../API/AdminAPI.js"; 
import logo from "../components/images/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
     
      const response = await loginEmployee(email, password);
      const { token, employee } = response;

      
      const adminEmails = [
        "packageadmin@skwphotography.com",
        "resourceadmin@skwphotography.com",
        "hradmin@gmail.com",
        "admin4@example.com",
        "admin5@example.com",
        "productadmin@gmail.com"
      ];

      if (adminEmails.includes(email)) {
        if (employee.jobRole === "Admin") {
          
          localStorage.setItem("token", token);

          
          if (email === "packageadmin@skwphotography.com") {
            navigate("/PDashboard"); 
          } else if (email === "resourceadmin@skwphotography.com") {
            navigate("/RDashbaord"); 
          } else if (email === "hradmin@gmail.com") {
            navigate("/admin/hr-dashboard"); 
          } else if(email==="productadmin@gmail.com"){
            navigate("/productdash");
          }
          
          else {
            navigate("/admin/dashboard"); 
          }
        } else {
          setErrorMessage("You do not have admin privileges.");
        }
      } else {
        setErrorMessage("Invalid email for admin.");
      }
    } catch (error) {
      setErrorMessage("Invalid credentials or server error.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="w-full max-w-md p-8 bg-black shadow-lg rounded-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Admin Logo"
            className="w-50 h-50"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-4">
          Login
        </h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
