import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaPhone, FaIdCard, FaHome, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2"; 
import dot from "../components/images/dot.jpg"; 
import { fetchUserDetails } from "../Api/AuthAPI";
import { updateUserProfile } from "../Api/CustomerAPI"

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    customerId: "",
    active: true,
    createdAt: "",
    otpVerified: true,
  });

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchUserDetails(); 
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error fetching your details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const userId = await fetchUserDetails();
    try {
      const updatedData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        nic : user.nic
      };
  
      const updatedUser = await updateUserProfile(userId._id, updatedData); 
      setUser(updatedUser.customer);
      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setIsEditing(false); 
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an error updating your profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleClose = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be redirected to the homepage.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/"); 
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-white-400 to-purple-500"
      style={{
        backgroundImage: `url(${dot})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full md:w-[500px] lg:w-[600px] p-10 bg-white rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-gray-600 text-8xl mb-4" />
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full text-center focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <h2 className="text-3xl font-semibold">{user.name}</h2>
          )}
          <p className={`text-sm ${user.active ? "text-green-600" : "text-red-600"}`}>
            {user.active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="mt-8">
          <div className="space-y-6">
            {["email", "phone", "nic", "address"].map((field) => (
              <p key={field} className="flex items-center gap-3 text-gray-700 bg-gray-100 p-3 rounded-lg">
                {field === "email" && <FaEnvelope className="text-gray-500" />}
                {field === "phone" && <FaPhone className="text-gray-500" />}
                {field === "nic" && <FaIdCard className="text-gray-500" />}
                {field === "address" && <FaHome className="text-gray-500" />}
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={user[field]}
                    onChange={handleChange}
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  user[field]
                )}
              </p>
            ))}
            <p className="text-gray-700 font-semibold">Customer ID: {user.customerId}</p>
            <p className="text-gray-700 font-semibold">Joined: {user.createdAt}</p>
            <p className={`text-sm font-semibold ${user.otpVerified ? "text-green-600" : "text-red-600"}`}>
              OTP Verified: {user.otpVerified ? "Yes" : "No"}
            </p>
          </div>
          <div className="mt-8 flex justify-between">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="text-white px-6 py-3 bg-green-500 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
              >
                <FaSave className="text-white text-lg" /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-white px-6 py-3 bg-yellow-500 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
              >
                <FaEdit className="text-white text-lg" /> Edit
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-white px-6 py-3 bg-red-500 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
            >
              <FaTimes className="text-white text-lg" /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
