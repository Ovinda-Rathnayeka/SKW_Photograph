import React, { useState } from "react";
import { signup } from "../Api/AuthAPI.js";  
import { useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";

function SignupPage({ setIsLoggedIn }) {
  const [userData, setUserData] = useState({
    name: "",
    nic: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
      setIsLoggedIn(true);  
      navigate("/Home");  
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-6">
      <div className="w-full max-w-4xl bg-[#161B22] p-8 rounded-2xl shadow-lg">
        {/* Logo with fixed height */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#E66A4E]">
          Signup
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-6">
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
            <label className="block text-gray-300">NIC</label>
            <input
              type="text"
              name="nic"
              value={userData.nic}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
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

          <div className="col-span-2">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full mt-6 p-3 bg-[#E66A4E] rounded-xl text-white font-bold hover:bg-[#C2563F] transition"
            >
              Signup ➝
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
