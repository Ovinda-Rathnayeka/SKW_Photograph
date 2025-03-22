import React, { useState } from "react";
import { login, verifyOTP } from "../Api/AuthAPI.js";
import { Link, useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";
import Swal from "sweetalert2";

function LoginPage({ setIsLoggedIn }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(credentials);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("_id", JSON.stringify(user._id));
      setIsOtpSent(true);
      setError("");

      Swal.fire({
        title: "OTP Sent!",
        text: "Please check your email for the OTP code.",
        icon: "success",
        confirmButtonColor: "#E66A4E",
      });
    } catch (err) {
      Swal.fire({
        title: "Login Failed",
        text: "Invalid email or password",
        icon: "error",
        confirmButtonColor: "#E66A4E",
      });
      setError("Invalid email or password");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const verificationResponse = await verifyOTP({
        email: credentials.email,
        otp: otp,
      });
      sessionStorage.setItem("user", JSON.stringify(verificationResponse));
      setIsLoggedIn(true);

      Swal.fire({
        title: "Success!",
        text: "You have been logged in successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/Home");
      });
    } catch (err) {
      Swal.fire({
        title: "Verification Failed",
        text: "Invalid OTP",
        icon: "error",
        confirmButtonColor: "#E66A4E",
      });
      setError("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-6">
      <div className="w-full max-w-md bg-[#161B22] p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-50 h-50 object-contain" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#E66A4E]">Login</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {!isOtpSent ? (
          <form onSubmit={handleLoginSubmit} className="mt-6">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />

            <label className="block text-gray-300 mt-4">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />

            <button
              type="submit"
              className="w-full mt-6 p-3 bg-[#E66A4E] rounded-xl text-white font-bold hover:bg-[#C2563F] transition"
            >
              Login ➝
            </button>

            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#E66A4E] cursor-pointer hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="mt-6">
            <label className="block text-gray-300">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              required
              maxLength={6}
              className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
            />

            <button
              type="submit"
              className="w-full mt-6 p-3 bg-[#E66A4E] rounded-xl text-white font-bold hover:bg-[#C2563F] transition"
            >
              Verify OTP ➝
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;