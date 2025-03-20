import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Edit, Trash2 } from "lucide-react"; 
import axios from "axios";

function Feedbacks({ feedback = {} }) {
  const { _id, user, category, title, rating, comment, createdAt, updatedAt } = feedback;

  const [showPopup, setShowPopup] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Function to show delete confirmation popup
  const confirmDelete = (id) => {
    setDeletingId(id);
    setShowPopup(true);
  };

  // Function to delete feedback
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/feedbacks/${deletingId}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback. Please try again.");
    }
    setShowPopup(false);
  };

  if (!user) {
    return <p className="text-red-500 text-center">Invalid feedback data</p>;
  }

  return (
    <>
      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full bg-white text-black rounded-xl shadow-lg overflow-hidden my-4 p-6 flex flex-col justify-between"
      >
        {/* Card Header - Profile Image, User Name & Category */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={`https://i.pravatar.cc/50?u=${user}`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full shadow-md"
            />
            <h2 className="text-lg font-semibold">{user}</h2> 
          </div>
          <span className="bg-gray-200 text-black px-3 py-1 rounded-full text-xs">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-md font-semibold mt-3">{title}</h3>

        {/* Rating & Comment Section */}
        <div className="mt-3">
          <p className="text-sm flex items-center">
            <span className="font-medium">Rating:</span>{" "}
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="text-yellow-400 w-4 h-4 mx-1" fill="currentColor" />
            ))}
          </p>
          <p className="text-sm mt-2">{comment}</p>
        </div>

        {/* Created At & Updated At Dates */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Created At: {new Date(createdAt).toLocaleString()}</p>
          {updatedAt && <p>Last Modified: {new Date(updatedAt).toLocaleString()}</p>}
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-4 flex flex-wrap justify-center gap-4">
          {/* Update Button */}
          <Link
            to={`/feedbacks/${_id}`}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <Edit size={18} /> Update
          </Link>

          {/* Delete Button (Triggers Popup) */}
          <button
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            onClick={() => confirmDelete(_id)}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </motion.div>

      {/* Delete Confirmation Popup (No Blur, Dark Background Retained) */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600">Are you sure you want to delete this feedback?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedbacks;
