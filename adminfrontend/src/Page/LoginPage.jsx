// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";
import { loginEmployee } from "../API/AdminAPI.js";

const roleToRoute = {
  packageBookingManager: "/package-booking/dashboard",
  resourceManager: "/resource-manager/dashboard",
  feedbackManager: "/feedback-manager/dashboard",
  hrManager: "/HRDashbaord",
  photographers: "/photographers/dashboard",
  videographers: "/videographers/dashboard",
  helpers: "/helpers/dashboard",
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

<<<<<<< HEAD
    const adminEmails = [
      "packageadmin@skwphotography.com",
      "resourceadmin@skwphotography.com",
      "hradmin@gmail.com",
      "feedback@gmail.com",
      "admin5@example.com",
    ];

    if (!adminEmails.includes(email)) {
      setErrorMessage("Invalid admin email.");
      return;
    }

    if (password !== "123") {
      setErrorMessage("Incorrect password. Please use password: 123");
      return;
    }

    // Login success
    localStorage.setItem("token", "dummy-token-123456"); // You can save any dummy token

    // Redirect based on email
    if (email === "packageadmin@skwphotography.com") {
      navigate("/PDashboard");
    } else if (email === "resourceadmin@skwphotography.com") {
      navigate("/RDashbaord");
    } else if (email === "hradmin@gmail.com") {
      navigate("/admin/hr-dashboard");
    } else if (email === "feedback@gmail.com") {
      navigate("/feedbackDashboard");
=======
    try {
      const { token, user } = await loginEmployee(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("employee", JSON.stringify(user));

      const route = roleToRoute[user.jobRole];
      if (!route) {
        setErrorMessage("You do not have access to any dashboard.");
      } else {
        navigate(route);
      }
    } catch (err) {
      setErrorMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
>>>>>>> main
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-black text-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
<<<<<<< HEAD
          <img src={logo} alt="Admin Logo" className="w-50 h-50" />
=======
          <img src={logo} alt="Logo" className="w-24 h-24" />
>>>>>>> main
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;