import React, { useState } from "react";
import { signup } from "../Api/AuthAPI.js";
import { Link, useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";
import Swal from "sweetalert2";

function SignupPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      setPasswordErrors(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordValidationErrors = validatePassword(userData.password);
    if (passwordValidationErrors.length > 0) {
      setError("Please fix password requirements");
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const submitData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      await signup(submitData);
      setIsLoggedIn(true);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
      Swal.fire({
        title: "Error!",
        text: err.message || "Signup failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-6">
      <div className="w-full max-w-md bg-[#161B22] p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#E66A4E]">
          Signup
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />
            {passwordErrors.length > 0 && (
              <ul className="mt-2 text-sm text-red-400">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full mt-6 p-3 bg-[#E66A4E] rounded-xl text-white font-bold hover:bg-[#C2563F] transition"
            >
              Signup ➝
            </button>
            <div className="text-white flex mt-4">
              Already have an account?
              <Link to="/login" className="text-red-300">
                {" "}
                Let me Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
