import React, { useState } from "react";
import { login, verifyOTP } from "../Api/AuthAPI.js"; 
import { useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";
import Swal from "sweetalert2"; // Import SweetAlert2

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(credentials);
      sessionStorage.setItem("user", JSON.stringify(user)); 
      setIsOtpSent(true); 
      setError(""); 
      
      // Show SweetAlert for OTP sent
      Swal.fire({
        title: 'OTP Sent!',
        text: 'An OTP has been sent to your email. Please enter it to continue.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (err) {
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
      navigate("/Home"); 
    } catch (err) {
      setError("Invalid OTP");
      // Show SweetAlert for invalid OTP
      Swal.fire({
        title: 'Error!',
        text: 'Invalid OTP. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-6">
      <div className="w-full max-w-md bg-[#161B22] p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-50 h-50 object-contain" />
        </div>
        <h2 className="text-center text-2xl font-semibold text-[#E66A4E]">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        
        {!isOtpSent ? (
          <form onSubmit={handleSubmit} className="mt-6">
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

        <p className="text-center text-gray-400 mt-4">
          If you don't have an account, <a href="/signup" className="text-[#E66A4E]">Sign Up</a> now.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
