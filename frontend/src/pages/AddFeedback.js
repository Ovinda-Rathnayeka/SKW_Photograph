import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import axios from "axios";

function AddFeedback() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    user: "",
    category: "",
    title: "",
    rating: "",
    comment: "",
  });

  const [errors, setErrors] = useState({}); // Store validation errors

  // Function to validate user name format
  const validateName = (name) => {
    const namePattern = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
    return namePattern.test(name);
  };

  // Function to validate rating (1-5, no decimals, no negative)
  const validateRating = (rating) => {
    const ratingPattern = /^[1-5]$/; // Only whole numbers 1-5
    return ratingPattern.test(rating);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    // Validation for each field
    if (name === "user") {
      newErrors.user = validateName(value)
        ? ""
        : "Name must start with a capital letter (e.g., Saman Kumara)";
    }
    if (name === "category") {
      newErrors.category = value ? "" : "Category must be selected.";
    }
    if (name === "title") {
      newErrors.title = value.trim() ? "" : "Title is required.";
    }
    if (name === "rating") {
      newErrors.rating = validateRating(value)
        ? ""
        : "Rating must be a whole number between 1 and 5.";
    }
    if (name === "comment") {
      newErrors.comment = value.trim() ? "" : "Comment cannot be empty.";
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors(newErrors); // Update validation errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any errors before submission
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/feedbacks", inputs);
      alert("Feedback submitted successfully!");
      history("/feedbacks"); // Navigate to feedback page
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <Nav />

      {/* Form Container */}
      <div className="flex-grow flex items-center justify-center mt-12 mb-16">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-orange-400 text-3xl font-bold text-center mb-6">
            Add Feedback
          </h1>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Input */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                name="user"
                value={inputs.user}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.user ? "border-red-500" : ""
                }`}
                placeholder="Enter your name"
                required
              />
              {errors.user && (
                <p className="text-red-500 text-sm">{errors.user}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Category
              </label>
              <select
                name="category"
                value={inputs.category}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select Category</option>
                <option value="Package">📦 Package</option>
                <option value="Rental">🏠 Rental</option>
                <option value="Purchase">🛒 Purchase</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-gray-700 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={inputs.title}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter feedback title"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Rating Input */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                value={inputs.rating}
                onChange={handleChange}
                min="1"
                max="5"
                className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rating ? "border-red-500" : ""
                }`}
                placeholder="Enter rating"
                required
              />
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating}</p>
              )}
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Comment
              </label>
              <textarea
                name="comment"
                value={inputs.comment}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.comment ? "border-red-500" : ""
                }`}
                placeholder="Write your feedback..."
                rows="4"
                required
              ></textarea>
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment}</p>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              {/* Submit Feedback Button */}
              <button
                type="submit"
                className={`flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto ${
                  Object.values(errors).some((error) => error)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={Object.values(errors).some((error) => error)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Submit Feedback
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => history("/feedbacks")}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFeedback;
