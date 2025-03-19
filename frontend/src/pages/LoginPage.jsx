import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login, verifyOTP, signup } from "../Api/AuthAPI.js";
import { useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";
import Swal from "sweetalert2";

function LoginPage({ setIsLoggedIn }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();

  const signUpSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    nic: yup.string().required("nic is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string()
    .matches(
      /^07\d{8}$/, 
      "Phone number must be in the format: 07XXXXXXXX"
    )
    .required('Phone number is required'),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "onChange"
  });

  
  const onSignUpSubmit = async (data) => {
    try {
      const { confirmPassword, ...registrationData } = data;
      
      const response = await signup(registrationData);
      
     
      Swal.fire({
        title: "Success!",
        text: "Your account has been created successfully. Please check your email for verification.",
        icon: "success",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#E66A4E",
      }).then(() => {
        
        setIsSignUp(false);
        reset();
      });
    } catch (error) {
      
      Swal.fire({
        title: "Registration Failed",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#E66A4E",
      });
    }
  };

  
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
      sessionStorage.setItem("_id",JSON.stringify(user._id))
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
        showConfirmButton: false
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

  
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError("");
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-6">
      <div className="w-full max-w-md bg-[#161B22] p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-50 h-50 object-contain" />
        </div>
        
        <h2 className="text-center text-2xl font-semibold text-[#E66A4E]">
          {isSignUp ? "Create Account" : "Login"}
        </h2>
        
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        
        {isSignUp ? (
        
        <form onSubmit={handleSubmit(onSignUpSubmit)} className="mt-6">
        <div className="mb-4">
          <label className="block text-gray-300">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300">NIC</label>
          <input
            type="nic"
            {...register("nic")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.nic && (
            <p className="text-red-500 text-sm mt-1">{errors.nic.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300">phone</label>
          <input
            type="phone"
            {...register("phone")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300">address</label>
          <input
            type="text"
            {...register("address")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full p-2 mt-1 bg-[#0D1117] border border-gray-600 rounded-lg text-white"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
       
        <button
          type="submit"
          className="w-full mt-4 p-3 bg-[#E66A4E] rounded-xl text-white font-bold hover:bg-[#C2563F] transition"
        >
          Sign Up ➝
        </button>
        
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={toggleSignUp}
            className="text-[#E66A4E] cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </form>
        ) : !isOtpSent ? (
          
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
              <span
                onClick={toggleSignUp}
                className="text-[#E66A4E] cursor-pointer hover:underline"
              >
                Sign up here
              </span>
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